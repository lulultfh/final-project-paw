const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Pastikan path ini benar

router.post('/', (req, res) => {
  const { ids } = req.body; // Ambil array 'ids' dari body request

  // Validasi input
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Array of product IDs is required.' });
  }

  // Query SQL yang efisien untuk mengambil banyak produk berdasarkan ID.
  // Klausa IN(?) sangat aman dari SQL Injection jika digunakan dengan library mysql2.
  const query = 'SELECT * FROM product WHERE id IN (?)';
  
  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error('Failed to fetch product details for cart:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Jika berhasil, kirim kembali array berisi detail produk
    res.json(results);
  });
});

module.exports = router;