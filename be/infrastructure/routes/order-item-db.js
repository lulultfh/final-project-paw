const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Ambil semua data dari tabel order_item
router.get("/", (req, res) => {
  const query = "SELECT * FROM order_item";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching order items:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Ambil data order_item berdasarkan ID
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM order_item WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Error fetching order item by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.json(results[0]);
  });
});

// Tambah data baru ke tabel order_item
router.post("/", (req, res) => {
  const { order_id, product_id, qty, subtotal } = req.body;

  if (!order_id || !product_id || !qty || !subtotal) {
    return res.status(400).json({ error: "Semua kolom wajib diisi!" });
  }

  const query = "INSERT INTO order_item (order_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)";
  const values = [order_id, product_id, qty, subtotal];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating new order item:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const newOrderItem = {
      id: results.insertId,
      order_id,
      product_id,
      qty,
      subtotal,
    };
    res.status(201).json(newOrderItem);
  });
});

// Ubah data order_item berdasarkan ID
router.put("/:id", (req, res) => {
  const { order_id, product_id, qty, subtotal } = req.body;

  if (!order_id || !product_id || !qty || !subtotal) {
    return res.status(400).json({ error: "Semua kolom wajib diisi!" });
  }

  const query = "UPDATE order_item SET order_id = ?, product_id = ?, qty = ?, subtotal = ? WHERE id = ?";
  const values = [order_id, product_id, qty, subtotal, req.params.id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating order item:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.json({ id: req.params.id, order_id, product_id, qty, subtotal });
  });
});

// Hapus data order_item berdasarkan ID
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM order_item WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Error deleting order item:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.status(204).send(); // No content
  });
});

module.exports = router;