const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasiaSuper";
const multer = require('multer');
const upload = multer({ dest: './uploads/avatar_user/' });

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

// Fungsi untuk update user
async function updateUser(userId, userData) {
  const { nama, username, email, profileImage } = userData;

  // Validasi wajib
  if (!nama || !username || !email) {
    throw new Error("Nama, username, dan email wajib diisi.");
  }

  // Cek apakah user ada
  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  // Cek duplikat username/email
  const existingUser = await db.get(
    'SELECT id FROM users WHERE username = ? AND id != ?',
    [username, userId]
  );
  if (existingUser) {
    throw new Error("Username sudah digunakan.");
  }

  const existingEmail = await db.get(
    'SELECT id FROM users WHERE email = ? AND id != ?',
    [email, userId]
  );
  if (existingEmail) {
    throw new Error("Email sudah digunakan.");
  }

  // Update data user
  await db.run(
    'UPDATE users SET nama = ?, username = ?, email = ? WHERE id = ?',
    [nama, username, email, userId]
  );

  // Handle upload gambar jika ada
  if (profileImage) {
    // Hapus gambar lama jika ada
    if (user.image && user.image !== null) {
      const oldImagePath = `./uploads/avatar_user/${user.image}`;
      try {
        require('fs').unlinkSync(oldImagePath);
      } catch (err) {
        console.warn("Gagal hapus gambar lama:", err);
      }
    }

    // Simpan gambar baru
    const fileName = `${Date.now()}_${profileImage.name}`;
    const filePath = `./uploads/avatar_user/${fileName}`;

    // Salin file ke folder uploads
    require('fs').createReadStream(profileImage.path).pipe(
      require('fs').createWriteStream(filePath)
    );

    // Simpan path ke database
    await db.run('UPDATE users SET image = ? WHERE id = ?', [fileName, userId]);
  }

  return await db.get('SELECT id, nama, username, email, image FROM users WHERE id = ?', [userId]);
}

// Route PUT /users/:id
app.put('/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { nama, username, email } = req.body;

    // Validasi input
    if (!nama || !username || !email) {
      return res.status(400).json({ error: "Nama, username, dan email wajib diisi." });
    }

    // Update user
    const updatedUser = await updateUser(userId, {
      nama,
      username,
      email,
      profileImage: req.file // Ini berisi file yang diupload
    });

    res.json({
      message: "Profil berhasil diperbarui!",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  router, updateUser,
};