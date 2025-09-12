const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer = require('multer');
const path = require('path');
const fs = require("fs");

// Setup upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
            const uploadPath = './uploads/bukti_bayar/';
            // Buat folder jika belum ada
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Generate nama file unique dengan timestamp
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'buktiBayar-' + uniqueSuffix + path.extname(file.originalname));
        }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (JPEG, JPG, PNG, GIF) yang diizinkan'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maksimal 5MB
    }
});

// GET /api/order
router.get("/", (req, res) => {
    const query = `
        SELECT
            o.id,
            o.status,
            o.tanggal,
            u.nama AS user_name,
            COALESCE(SUM(oi.subtotal), 0) AS total_price,
            o.bukti_bayar,
            GROUP_CONCAT(
                CONCAT(
                    IFNULL(p.namaProduct, 'Produk tidak ditemukan'),
                    ' (', oi.qty, ')'
                )
                SEPARATOR ', '
            ) AS products_summary
        FROM \`order\` o
        JOIN user u ON o.user_id = u.id
        LEFT JOIN order_item oi ON o.id = oi.order_id
        LEFT JOIN product p ON oi.product_id = p.id
        GROUP BY 
            o.id, 
            u.nama, 
            o.status, 
            o.tanggal, 
            o.bukti_bayar
        ORDER BY o.tanggal DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// POST /api/order
router.post('/', upload.single('paymentProof'), (req, res) => {
    const { user_id, items } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "user_id wajib diisi" });
    }

    let itemsArray = [];
    if (items) {
        try {
            itemsArray = JSON.parse(items);
        } catch (e) {
            return res.status(400).json({ message: "Format items tidak valid" });
        }
    }

    // ✅ Validasi minimal ada item
    if (itemsArray.length === 0) {
        return res.status(400).json({ message: "Tidak ada item untuk dipesan" });
    }

    const buktiBayar = req.file ? req.file.filename : null;

    // ✅ INSERT order dulu dengan total_harga = 0
    const insertOrderQuery = `
        INSERT INTO \`order\` (user_id, total_harga, bukti_bayar, status, tanggal)
        VALUES (?, 0, ?, 'process', NOW())
    `;
    const orderValues = [user_id, buktiBayar];

    db.query(insertOrderQuery, orderValues, (err, result) => {
        if (err) {
            console.error("Gagal simpan order:", err);
            return res.status(500).json({ message: "Gagal membuat pesanan" });
        }

        const orderId = result.insertId;

        // ✅ INSERT order_item dengan harga dari tabel product
        if (itemsArray.length > 0) {
            const insertPromises = itemsArray.map(item => {
                return new Promise((resolve, reject) => {
                    const qty = parseInt(item.qty) || 0;
                    const productId = item.product_id;

                    if (qty <= 0 || !productId) {
                        return reject(new Error(`Item tidak valid: product_id=${productId}, qty=${qty}`));
                    }

                    const query = `
                        INSERT INTO \`order_item\` (order_id, product_id, qty, subtotal)
                        SELECT ?, p.id, ?, p.price * ?
                        FROM product p
                        WHERE p.id = ?
                    `;

                    db.query(query, [orderId, qty, qty, productId], (err, result) => {
                        if (err) {
                            console.error(`Gagal insert order_item untuk product_id ${productId}:`, err);
                            reject(err);
                        } else if (result.affectedRows === 0) {
                            reject(new Error(`Produk dengan ID ${productId} tidak ditemukan`));
                        } else {
                            resolve(result);
                        }
                    });
                });
            });

            Promise.all(insertPromises)
                .then(() => {
                    // ✅ UPDATE total_harga di tabel order berdasarkan jumlah subtotal
                    const updateTotalQuery = `
                        UPDATE \`order\` o
                        SET total_harga = (
                            SELECT COALESCE(SUM(oi.subtotal), 0)
                            FROM order_item oi
                            WHERE oi.order_id = o.id
                        )
                        WHERE o.id = ?
                    `;

                    db.query(updateTotalQuery, [orderId], (err) => {
                        if (err) {
                            console.error("Gagal update total_harga:", err);
                            return res.status(500).json({ message: "Gagal memperbarui total harga" });
                        }

                        // ✅ Ambil total_harga terbaru untuk response
                        db.query('SELECT total_harga FROM `order` WHERE id = ?', [orderId], (err, result) => {
                            if (err) {
                                console.error("Gagal ambil total_harga:", err);
                                return res.status(500).json({ message: "Gagal mengambil total harga" });
                            }

                            const finalTotal = result[0]?.total_harga || 0;

                            res.status(201).json({
                                id: orderId,
                                user_id,
                                total_harga: finalTotal,
                                bukti_bayar: buktiBayar,
                                status: 'process',
                                tanggal: new Date()
                            });
                        });
                    });
                })
                .catch(err => {
                    console.error("Error menyimpan order_item:", err.message || err);
                    // Optional: Delete order if item failed
                    db.query('DELETE FROM `order` WHERE id = ?', [orderId], () => {});
                    return res.status(500).json({ message: "Gagal menyimpan detail pesanan: " + (err.message || "unknown error") });
                });
        } else {
            // Jika tidak ada item, biarkan total_harga = 0
            res.status(201).json({
                id: orderId,
                user_id,
                total_harga: 0,
                bukti_bayar: buktiBayar,
                status: 'process',
                tanggal: new Date()
            });
        }
    });
});

// PUT /api/order/:id
router.put('/:id', (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Status wajib diisi" });
    }

    db.query('UPDATE `order` SET status = ? WHERE id = ?', [status, req.params.id], (err, results) => {
        if (err) {
            console.error("Gagal update status:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Order tidak ditemukan');
        }
        res.json({ id: req.params.id, status });
    });
});

// DELETE /api/order/:id
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM `order` WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error("Gagal hapus order:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Order tidak ditemukan');
        }
        res.status(204).send();
    });
});

module.exports = router;