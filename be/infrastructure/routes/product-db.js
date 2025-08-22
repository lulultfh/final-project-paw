const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM product", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM product WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Produk tidak ditemukan');
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { nama, price, desc, image, stok, kategori } = req.body;
    if (!nama || !price || !desc || !image || !stok || !kategori) {
        return res.status(400).send('Semua kolom wajib diisi!');
    }

    const query = 'INSERT INTO product (namaProduct, price, description, image, stok, kategori) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nama.trim(), price, desc.trim(), image.trim(), stok, kategori.trim()];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        const newProduct = {
            id: results.insertId,
            nama: nama.trim(),
            price: price,
            desc: desc.trim(),
            image: image.trim(),
            stok: stok,
            kategori: kategori.trim()
        };

        res.status(201).json(newProduct);
    });
});

router.put('/:id', (req, res) => {
    const { nama, price, desc, image, stok, kategori } = req.body;

    db.query('UPDATE product SET namaProduct = ?, price = ?, description = ?, image = ?, stok = ?, kategori = ? WHERE id = ?', [nama, price, desc, image, stok, kategori, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Produk tidak ditemukan');
        res.json({ id: req.params.id, nama, price, desc, image, stok, kategori });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM product WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Product tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;