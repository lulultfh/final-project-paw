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

router.get("/admin", async (req, res) => {
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

  try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/admin/download/:filename', (req, res) => {
    const { filename } = req.params;
    // Path ini mengasumsikan folder 'uploads' sejajar dengan folder 'routes'
    const filePath = path.join(process.cwd(), 'uploads/bukti_bayar', filename);

    // res.download() secara otomatis mengatur header untuk memaksa unduhan
    res.download(filePath, (err) => {
        if (err) {
            console.error("File download error:", err);
            console.error("Failed to find file at path:", filePath);
            res.status(404).send('File not found.');
        }
    });
});

router.get('/invoice/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        // [PERBAIKAN] Menggunakan nama tabel yang benar: `order` dan `user`
        const orderQuery = `
            SELECT 
                o.id, 
                o.tanggal, 
                o.total_harga AS total_price, -- Menggunakan total_harga sesuai skema Anda
                o.status, 
                u.nama as user_name, 
                u.email as user_email 
            FROM \`order\` o
            JOIN \`user\` u ON o.user_id = u.id
            WHERE o.id = ?
        `;
        const [orderResult] = await db.query(orderQuery, [id]);

        if (orderResult.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderData = orderResult[0];

        // [PERBAIKAN] Menggunakan nama tabel yang benar: `order_item` dan `product`
        const itemsQuery = `
            SELECT 
                oi.qty, 
                oi.subtotal, 
                p.namaProduct,
                p.image
            FROM \`order_item\` oi
            JOIN \`product\` p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;
        const [itemsResult] = await db.query(itemsQuery, [id]);

        const fullInvoiceData = {
            ...orderData,
            items: itemsResult
        };

        res.status(200).json(fullInvoiceData);

    } catch (error) {
        console.error('Error fetching invoice data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/order
router.get("/", async (req, res) => {
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

  try {
        const [results] = await db.query(query, [userId]);
        const ordersMap = new Map();
        results.forEach((row) => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    id: row.order_id, status: row.status, tanggal: row.tanggal,
                    total_price: row.total_harga, customer_name: row.customer_name,
                    items: [],
                });
            }
            ordersMap.get(row.order_id).items.push({
                product_id: row.product_id, namaProduct: row.namaProduct, image: row.image,
                qty: row.qty, subtotal: row.subtotal,
            });
        });
        res.json(Array.from(ordersMap.values()));
    } catch (error) {
        console.error("Error fetching detailed orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/order
router.post('/', upload.single('paymentProof'), async (req, res) => {
    const { user_id, items } = req.body;
    if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

    
    let itemsArray;
    try {
        itemsArray = JSON.parse(items);
        // Pastikan semua data yang dibutuhkan ada sebelum melanjutkan
        if (!user_id || !req.file || !Array.isArray(itemsArray) || itemsArray.length === 0) {
            // Jika ada file terupload saat validasi gagal, hapus lagi
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Data tidak lengkap. User ID, bukti bayar, dan item wajib diisi." });
        }
    } catch (e) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Format items tidak valid." });
    }

    let connection;

    try {
        // 2. "Pinjam" satu koneksi dari pool
        connection = await db.getConnection();
        
        // 3. Mulai transaksi
        await connection.beginTransaction();

        // Cek Stok Produk terlebih dahulu
        const productIds = itemsArray.map(item => item.product_id);
        const [products] = await connection.query(`SELECT id, namaProduct, stok, price FROM product WHERE id IN (?) FOR UPDATE`, [productIds]);
        
        const productMap = new Map(products.map(p => [p.id, p]));
        for (const item of itemsArray) {
            const product = productMap.get(item.product_id);
            if (!product) {
                throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);
            }
            if (product.stok < item.qty) {
                throw new Error(`Stok untuk produk "${product.namaProduct}" tidak mencukupi (sisa ${product.stok}).`);
            }
        }

        // Jika semua stok aman, lanjutkan proses order
        const buktiBayar = req.file.filename;
        const [orderResult] = await connection.query(`INSERT INTO \`order\` (user_id, total_harga, bukti_bayar, status, tanggal) VALUES (?, 0, ?, 'process', NOW())`, [user_id, buktiBayar]);
        const orderId = orderResult.insertId;

        let totalHarga = 0;
        for (const item of itemsArray) {
            const product = productMap.get(item.product_id);
            const subtotal = product.price * item.qty;
            totalHarga += subtotal;
            // Insert ke order_item
            await connection.query(`INSERT INTO \`order_item\` (order_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)`, [orderId, item.product_id, item.qty, subtotal]);
            // Kurangi stok produk
            await connection.query(`UPDATE product SET stok = stok - ? WHERE id = ?`, [item.qty, item.product_id]);
        }

        // Update total harga di tabel order
        await connection.query(`UPDATE \`order\` SET total_harga = ? WHERE id = ?`, [totalHarga, orderId]);

        // 4. Jika semua query berhasil, simpan perubahan secara permanen
        await connection.commit();
        res.status(201).json({ id: orderId, message: "Pesanan berhasil dibuat" });

    } catch (error) {
        // 5. Jika ada satu saja error, batalkan semua perubahan
        if (connection) await connection.rollback();
        
        console.error("Error saat membuat pesanan:", error);

        // Hapus file yang sudah diupload jika transaksi gagal
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Gagal menghapus file bukti bayar setelah error:", err);
            });
        }
        
        res.status(500).json({ message: error.message || "Gagal membuat pesanan" });

    } finally {
        // 6. WAJIB: Kembalikan koneksi ke pool setelah semua selesai
        if (connection) connection.release();
    }
});

// PUT /api/order/:id
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Status wajib diisi" });
    }

    try {
        const [results] = await db.query('UPDATE `order` SET status = ? WHERE id = ?', [status, req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).send('Order tidak ditemukan');
        }
        res.json({ id: req.params.id, status });
    } catch (error) {
        console.error("Gagal update status:", error);
        return res.status(500).send('Internal Server Error');
    }
});

// DELETE /api/order/:id
router.delete('/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        await db.query('DELETE FROM `order_item` WHERE order_id = ?', [orderId]);
        const [orderResults] = await db.query('DELETE FROM `order` WHERE id = ?', [orderId]);
        
        if (orderResults.affectedRows === 0) {
            return res.status(404).send('Order tidak ditemukan');
        }
        res.status(204).send();
    } catch (error) {
        console.error("Gagal hapus order:", error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;