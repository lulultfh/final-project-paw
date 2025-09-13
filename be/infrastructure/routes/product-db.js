const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../database/db");

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/products/';
        // Buat folder jika belum ada
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate nama file unique dengan timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter file untuk hanya menerima gambar
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

// Enum kategori yang diizinkan
const ALLOWED_CATEGORIES = ['cake', 'pastry', 'bread', 'cookies'];

// Validasi kategori
const validateCategory = (kategori) => {
    return ALLOWED_CATEGORIES.includes(kategori);
};

// Validasi harga dan stok (tidak boleh minus)
const validatePriceAndStock = (price, stok) => {
    const numPrice = Number(price);
    const numStok = Number(stok);
    
    if (isNaN(numPrice) || numPrice < 0) {
        return { valid: false, message: 'Harga harus berupa angka dan tidak boleh minus' };
    }
    
    if (isNaN(numStok) || numStok < 0) {
        return { valid: false, message: 'Stok harus berupa angka dan tidak boleh minus' };
    }
    
    return { valid: true };
};

// GET semua produk
router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM product");
        res.json(results);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET produk berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM product WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST produk baru dengan upload gambar
router.post('/', upload.single('image'), async (req, res) => {
    const { nama, price, desc, stok, kategori } = req.body;
    
    // Validasi field wajib
    if (!nama || !price || !desc || !stok || !kategori) {
        // Hapus file yang sudah diupload jika ada error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Semua kolom wajib diisi!' });
    }
    
    // Validasi gambar
    if (!req.file) {
        return res.status(400).json({ error: 'Gambar produk wajib diupload!' });
    }
    
    // Validasi kategori
    if (!validateCategory(kategori)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
            error: 'Kategori tidak valid! Pilihan yang tersedia: ' + ALLOWED_CATEGORIES.join(', ')
        });
    }
    
    // Validasi harga dan stok
    const validation = validatePriceAndStock(price, stok);
    if (!validation.valid) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: validation.message });
    }
    
    try {
        const imagePath = req.file.filename;
        const query = 'INSERT INTO product (namaProduct, price, description, image, stok, kategori) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [nama.trim(), Number(price), desc.trim(), imagePath, Number(stok), kategori.trim()];
        
        const [results] = await db.query(query, values);
        
        const newProduct = { id: results.insertId, nama, price, desc, image: imagePath, stok, kategori };
        res.status(201).json(newProduct);
    } catch (error) {
        cleanupFileOnError();
        console.error('Database error on create product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update produk
router.put('/:id', upload.single('image'), async (req, res) => {
    const { nama, price, desc, stok, kategori } = req.body;
    
    // Validasi kategori jika ada
    if (kategori && !validateCategory(kategori)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
            error: 'Kategori tidak valid! Pilihan yang tersedia: ' + ALLOWED_CATEGORIES.join(', ')
        });
    }
    
    // Validasi harga dan stok jika ada
    if (price !== undefined || stok !== undefined) {
        const validation = validatePriceAndStock(price || 0, stok || 0);
        if (!validation.valid) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: validation.message });
        }
    }
    
    try {
        const [existingProducts] = await db.query('SELECT * FROM product WHERE id = ?', [req.params.id]);
        if (existingProducts.length === 0) {
            cleanupFileOnError();
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        const existingProduct = existingProducts[0];
        
        let imagePath = existingProduct.image;
        if (req.file) {
            // Hapus gambar lama jika ada
            if (existingProduct.image) {
                const oldImagePath = path.join('./uploads/products/', existingProduct.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            imagePath = req.file.filename;
        }
        
        const updateQuery = 'UPDATE product SET namaProduct = ?, price = ?, description = ?, image = ?, stok = ?, kategori = ? WHERE id = ?';
        const updateValues = [
            nama || existingProduct.namaProduct,
            price !== undefined ? Number(price) : existingProduct.price,
            desc || existingProduct.description,
            imagePath,
            stok !== undefined ? Number(stok) : existingProduct.stok,
            kategori || existingProduct.kategori,
            req.params.id
        ];
        
        await db.query(updateQuery, updateValues);
        
        res.json({ id: req.params.id, ...req.body, image: imagePath });
    } catch (error) {
        cleanupFileOnError();
        console.error('Database error on update product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE produk
router.delete('/:id', async (req, res) => {
     try {
        const [products] = await db.query('SELECT image FROM product WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        
        const product = products[0];
        const [deleteResults] = await db.query('DELETE FROM product WHERE id = ?', [req.params.id]);

        if (deleteResults.affectedRows > 0 && product.image) {
            const imagePath = path.join('./uploads/products/', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Database error on delete product:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route untuk serve gambar static
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '..', '..', 'uploads', 'products', filename);
    
    console.log('Mencari gambar di:', imagePath);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({ error: 'Gambar tidak ditemukan' });
    }
});

module.exports = router;