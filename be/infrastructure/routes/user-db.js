const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasiaSuper";

router.get("/", async (req, res) => {
  try {
        const [results] = await db.query("SELECT id, nama, username, email, role FROM user");
        res.json(results);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id', async (req, res) => {
     try {
        const [results] = await db.query('SELECT id, nama, username, email, role FROM user WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { nama, username, passwd, email, role} = req.body;
    if (!nama || !username || !passwd || !email || !role) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!'});
    }
    
    try {
        // Hash password langsung dengan await
        const hashedPassword = await bcrypt.hash(passwd, 10);

        const query = 'INSERT INTO user (nama, username, passwd, email, role) VALUES (?, ?, ?, ?, ?)';
        const values = [nama.trim(), username.trim(), hashedPassword, email.trim(), role.trim()];
        
        const [results] = await db.query(query, values);
        
        const newUser = {
            id: results.insertId, nama: nama.trim(), username: username.trim(),
            email: email.trim(), role: role.trim()
        };
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Database error on register:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username atau Email sudah terdaftar.' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/:id', async  (req, res) => {
    const { nama, username, passwd, email, role} = req.body;

     try {
        const [users] = await db.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        
        const user = users[0];
        
        // Cek apakah ada password baru yang dikirim. Jika ada, hash password tersebut.
        // Jika tidak, gunakan password lama yang sudah di-hash.
        const hashedPassword = passwd ? await bcrypt.hash(passwd, 10) : user.passwd;

        const query = 'UPDATE user SET nama = ?, username = ?, passwd = ?, email = ?, role = ? WHERE id = ?';
        const values = [
            nama || user.nama,
            username || user.username,
            hashedPassword,
            email || user.email,
            role || user.role,
            req.params.id
        ];
        
        await db.query(query, values);
        
        res.json({ id: req.params.id, nama, username, email, role });
    } catch (error) {
        console.error('Database error on update user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/:id', async  (req, res) => {
     try {
        const [results] = await db.query('DELETE FROM user WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Database error on delete user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/login", async (req, res) => {
  const { username, passwd } = req.body;

  if (!username || !passwd) {
    return res.status(400).json({ message: "Username dan password wajib diisi!" });
  }

  try {
        const [results] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: "Username atau password salah" });
        }

        const user = results[0];
        const match = await bcrypt.compare(passwd, user.passwd);

        if (!match) {
            return res.status(401).json({ message: "Username atau password salah" });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "3h" }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id, name: user.nama, username: user.username, role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;