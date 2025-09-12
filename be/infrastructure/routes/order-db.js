const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer = require('multer');
const path = require('path');

// Setup upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get("/admin", (req, res) => {
  // Query ini sama seperti query lama Anda yang menghasilkan ringkasan
  const query = `
    SELECT
        o.id,
        o.status,
        o.tanggal,
        o.bukti_bayar,
        u.nama AS customer_name, -- Menggunakan customer_name agar konsisten
        COALESCE(SUM(oi.subtotal), 0) AS total_price,
        GROUP_CONCAT(
            CONCAT(p.namaProduct, ' (', oi.qty, ')')
            SEPARATOR ', '
        ) AS products_summary
    FROM \`order\` o
    JOIN user u ON o.user_id = u.id
    LEFT JOIN order_item oi ON o.id = oi.order_id
    LEFT JOIN product p ON oi.product_id = p.id
    GROUP BY o.id, u.nama, o.status, o.tanggal, o.bukti_bayar
    ORDER BY o.tanggal DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admin orders:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

router.get('/admin/download/:filename', (req, res) => {
    const { filename } = req.params;
    // Path ini mengasumsikan folder 'uploads' sejajar dengan folder 'routes'
    const filePath = path.join(process.cwd(), 'uploads', filename);

    // res.download() secara otomatis mengatur header untuk memaksa unduhan
    res.download(filePath, (err) => {
        if (err) {
            console.error("File download error:", err);
            console.error("Failed to find file at path:", filePath);
            res.status(404).send('File not found.');
        }
    });
});

// GET /api/order
router.get("/", (req, res) => {
    const { userId } = req.query;
    if (!userId) { // <-- TAMBAHKAN BLOK INI
    return res.status(400).json({ error: "User ID is required" });
  }
  const query = `
    SELECT
        o.id AS order_id, o.status, o.tanggal, o.total_harga,
        oi.qty, oi.subtotal,
        p.id AS product_id, p.namaProduct, p.image,
        u.nama AS customer_name
    FROM \`order\` o
    JOIN \`user\` u ON o.user_id = u.id
    JOIN \`order_item\` oi ON o.id = oi.order_id
    JOIN \`product\` p ON oi.product_id = p.id
    WHERE o.user_id = ? 
    ORDER BY o.tanggal DESC, o.id ASC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching detailed orders:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const ordersMap = new Map();
    results.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          status: row.status,
          tanggal: row.tanggal,
          total_price: row.total_harga,
          customer_name: row.customer_name,
          items: [],
        });
      }
      ordersMap.get(row.order_id).items.push({
        product_id: row.product_id,
        namaProduct: row.namaProduct,
        image: row.image,
        qty: row.qty,
        subtotal: row.subtotal,
      });
    });
    const groupedOrders = Array.from(ordersMap.values());
    res.json(groupedOrders);
  });
});

// POST /api/order
router.post('/', upload.single('paymentProof'), (req, res) => {
    const { user_id, items } = req.body;
    if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

    let itemsArray;
    try {
        itemsArray = JSON.parse(items);
        if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
            return res.status(400).json({ message: "Tidak ada item untuk dipesan" });
        }
    } catch (e) {
        return res.status(400).json({ message: "Format items tidak valid" });
    }

    const buktiBayar = req.file ? req.file.filename : null;

    const insertOrderQuery = `
        INSERT INTO \`order\` (user_id, total_harga, bukti_bayar, status, tanggal)
        VALUES (?, 0, ?, 'process', NOW())
    `;

    db.query(insertOrderQuery, [user_id, buktiBayar], (err, result) => {
        if (err) {
            console.error("Gagal simpan order:", err);
            return res.status(500).json({ message: "Gagal membuat pesanan" });
        }
        
        const orderId = result.insertId;

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
                    FROM product p WHERE p.id = ?
                `;
                
                db.query(query, [orderId, qty, qty, productId], (err, result) => {
                    if (err || result.affectedRows === 0) {
                        return reject(err || new Error(`Produk dengan ID ${productId} tidak ditemukan`));
                    }
                    resolve(result);
                });
            });
        });

        Promise.all(insertPromises)
            .then(() => {
                const updateTotalQuery = `
                    UPDATE \`order\` SET total_harga = (
                        SELECT COALESCE(SUM(subtotal), 0) FROM order_item WHERE order_id = ?
                    ) WHERE id = ?
                `;
                db.query(updateTotalQuery, [orderId, orderId], (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ message: "Gagal memperbarui total harga" });
                    }
                    res.status(201).json({ id: orderId, message: "Pesanan berhasil dibuat" });
                });
            })
            .catch(err => {
                console.error("Error menyimpan order_item:", err.message || err);
                db.query('DELETE FROM `order` WHERE id = ?', [orderId], () => {}); // Rollback
                res.status(500).json({ message: "Gagal menyimpan detail pesanan: " + (err.message || "unknown error") });
            });
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
    const orderId = req.params.id;

    // Langkah 1: Hapus dulu semua item yang terkait dengan order ini
    const deleteItemsQuery = 'DELETE FROM `order_item` WHERE order_id = ?';

    db.query(deleteItemsQuery, [orderId], (err, itemResults) => {
        if (err) {
            console.error("Gagal hapus order items:", err);
            return res.status(500).send('Internal Server Error while deleting items');
        }

        // Langkah 2: Setelah item berhasil dihapus, baru hapus order utamanya
        const deleteOrderQuery = 'DELETE FROM `order` WHERE id = ?';
        db.query(deleteOrderQuery, [orderId], (err, orderResults) => {
            if (err) {
                console.error("Gagal hapus order:", err);
                return res.status(500).send('Internal Server Error while deleting order');
            }
            if (orderResults.affectedRows === 0) {
                // Ini terjadi jika order sudah dihapus tapi itemnya tidak ada
                return res.status(404).send('Order tidak ditemukan');
            }
            res.status(204).send(); // Sukses, tidak ada konten yang dikembalikan
        });
    });
});

module.exports = router;