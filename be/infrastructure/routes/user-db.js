const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasiaSuper";

router.get("/", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({message: 'Internal Server Error'});
        if (results.length === 0) return res.status(404).json({message: 'User tidak ditemukan'});
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { nama, username, passwd, email, role} = req.body;
    if (!nama || !username || !passwd || !email || !role) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!'});
    }
    
    bcrypt.hash(passwd, 10, (err, hashedPassword) => {
      if (err) {
            // Handle jika hashing gagal
            console.error('Error saat hashing password:', err);
            return res.status(500).json({ message: "Server error" });
      }

      const query = 'INSERT INTO user (nama, username, passwd, email, role) VALUES (?, ?, ?, ?, ?)';
      const values = [nama.trim(), username.trim(), hashedPassword, email.trim(), role.trim()];

      db.query(query, values, (err, results) => {
          if (err) {
              console.error('Database error:', err);
              if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Username atau Email sudah terdaftar.' });
              }
              return res.status(500).json({message: 'Internal Server Error'});
          }

          const newUser = {
              id: results.insertId,
              nama: nama.trim(),
              username: username.trim(),
              email: email.trim(),
              role: role.trim()
          };
          console.log('User baru berhasil dibuat:', newUser); 
          res.status(201).json(newUser);
      });
    });
});

router.put('/:id', (req, res) => {
    const { nama, username, passwd, email, role} = req.body;

    db.query('UPDATE user SET nama = ?, username = ?, passwd = ?, email = ?, role = ? WHERE id = ?', [nama, username, passwd, email, role, req.params.id], (err, results) => {
        if (err) return res.status(500).json({message: 'Internal Server Error'});
        if (results.affectedRows === 0) return res.status(404).json({message: 'User tidak ditemukan'});
        res.json({ id: req.params.id, nama, username, passwd, email, role});
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({message: 'Internal Server Error'});
        if (results.affectedRows === 0) return res.status(404).json({message: 'User tidak ditemukan'});
        res.status(204).json();
    });
});

router.post("/login", (req, res) => {
  const { username, passwd } = req.body;

  if (!username || !passwd) {
    return res.status(400).json({ message: "Username dan password wajib diisi!" });
  }

  db.query("SELECT * FROM user WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (results.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

    const user = results[0];
    const match = await bcrypt.compare(passwd, user.passwd);

    if (!match) {
      return res.status(401).json({ message: "Password salah!" });
    }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, 
        JWT_SECRET,
        { expiresIn: "3h" }
      );

    res.json({ message: "Login berhasil", token });
  });
});

module.exports = router;