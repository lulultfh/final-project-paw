const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Ambil semua data dari tabel order_item
router.get("/", async (req, res) => {
  const query = "SELECT * FROM order_item";
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ambil data order_item berdasarkan ID
router.get("/:id", async (req, res) => {
  const query = "SELECT * FROM order_item WHERE id = ?";
  try {
    const [results] = await db.query(query, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching order item by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Tambah data baru ke tabel order_item
router.post("/", async (req, res) => {
  const { order_id, product_id, qty, subtotal } = req.body;

  if (!order_id || !product_id || !qty || !subtotal) {
    return res.status(400).json({ error: "Semua kolom wajib diisi!" });
  }

  const query = "INSERT INTO order_item (order_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)";
  const values = [order_id, product_id, qty, subtotal];

  try {
    const [results] = await db.query(query, values);
    const newOrderItem = {
      id: results.insertId,
      order_id,
      product_id,
      qty,
      subtotal,
    };
    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error("Error creating new order item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ubah data order_item berdasarkan ID
router.put("/:id", async (req, res) => {
  const { order_id, product_id, qty, subtotal } = req.body;

  if (!order_id || !product_id || !qty || !subtotal) {
    return res.status(400).json({ error: "Semua kolom wajib diisi!" });
  }

  const query = "UPDATE order_item SET order_id = ?, product_id = ?, qty = ?, subtotal = ? WHERE id = ?";
  const values = [order_id, product_id, qty, subtotal, req.params.id];

  try {
    const [results] = await db.query(query, values);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.json({ id: req.params.id, order_id, product_id, qty, subtotal });
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Hapus data order_item berdasarkan ID
router.delete("/:id", async (req, res) => {
  const query = "DELETE FROM order_item WHERE id = ?";
  try {
    const [results] = await db.query(query, [req.params.id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Order item tidak ditemukan" });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting order item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;