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
router.get("/", (req, res) => {
    db.query("SELECT * FROM product", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// GET produk berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM product WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        if (results.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
        res.json(results[0]);
    });
});

// POST produk baru dengan upload gambar
router.post('/', upload.single('image'), (req, res) => {
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
    
    const imagePath = req.file.filename; // Hanya simpan nama file di database
    
    const query = 'INSERT INTO product (namaProduct, price, description, image, stok, kategori) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nama.trim(), Number(price), desc.trim(), imagePath, Number(stok), kategori.trim()];
    
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            // Hapus file jika ada error database
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const newProduct = {
            id: results.insertId,
            nama: nama.trim(),
            price: Number(price),
            desc: desc.trim(),
            image: imagePath,
            stok: Number(stok),
            kategori: kategori.trim()
        };
        
        res.status(201).json(newProduct);
    });
});

// PUT update produk
router.put('/:id', upload.single('image'), (req, res) => {
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
    
    // Cek apakah produk exist terlebih dahulu
    db.query('SELECT * FROM product WHERE id = ?', [req.params.id], (err, existingProduct) => {
        if (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        if (existingProduct.length === 0) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }
        
        let imagePath = existingProduct[0].image; // Gunakan gambar lama jika tidak ada upload baru
        
        // Jika ada upload gambar baru
        if (req.file) {
            // Hapus gambar lama jika ada
            if (existingProduct[0].image) {
                const oldImagePath = './uploads/products/' + existingProduct[0].image;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagePath = req.file.filename;
        }
        
        const updateQuery = 'UPDATE product SET namaProduct = ?, price = ?, description = ?, image = ?, stok = ?, kategori = ? WHERE id = ?';
        const updateValues = [
            nama || existingProduct[0].namaProduct,
            price ? Number(price) : existingProduct[0].price,
            desc || existingProduct[0].description,
            imagePath,
            stok ? Number(stok) : existingProduct[0].stok,
            kategori || existingProduct[0].kategori,
            req.params.id
        ];
        
        db.query(updateQuery, updateValues, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            res.json({ 
                id: req.params.id, 
                nama: updateValues[0], 
                price: updateValues[1], 
                desc: updateValues[2], 
                image: updateValues[3], 
                stok: updateValues[4], 
                kategori: updateValues[5] 
            });
        });
    });
});

// DELETE produk
router.delete('/:id', (req, res) => {
    // Ambil data produk terlebih dahulu untuk menghapus gambar
    db.query('SELECT * FROM product WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product tidak ditemukan' });
        }
        
        const product = results[0];
        
        // Hapus produk dari database
        db.query('DELETE FROM product WHERE id = ?', [req.params.id], (err, deleteResults) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            
            // Hapus file gambar jika ada
            if (product.image) {
                const imagePath = './uploads/products/' + product.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.status(204).send();
        });
    });
});

// Route untuk serve gambar static
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/products/', filename);
    
    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({ error: 'Gambar tidak ditemukan' });
    }
});

module.exports = router;