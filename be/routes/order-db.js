const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM order", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM order WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Order tidak ditemukan');
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).send('Semua kolom wajib diisi!');
    }

    const query = 'INSERT INTO order (status) VALUES (?)';
    const values = [status.trim()];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        const newOrder = {
            id: results.insertId,
            status: status.trim(),
            tangal: new Date()
        };

        res.status(201).json(newOrder);
    });
});

router.put('/:id', (req, res) => {
    const { status } = req.body;

    db.query('UPDATE order SET status = ? WHERE id = ?', [status, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Order tidak ditemukan');
        res.json({ id: req.params.id, status });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM order WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Order tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;