const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Pastikan path ini benar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs').promises; // Menggunakan fs/promises untuk operasi file async
const path = require('path');

// Konfigurasi Environment Variable untuk JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "rahasiaSuper";

const authMiddleware = require('../middleware/auth'); // Sesuaikan path jika perlu
const adminMiddleware = require('../middleware/authAdmin')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads/avatar_user/';
        // Membuat direktori jika belum ada
        fs.mkdir(dir, { recursive: true }).then(() => cb(null, dir)).catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        // Membuat nama file unik: timestamp + nama file asli
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const [results] = await db.query("SELECT id, nama, username, email, role, image FROM user");
        res.json(results);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {

    const loggedInUser = req.user; // Didapat dari token
    const requestedUserId = req.params.id;

    if (loggedInUser.role !== 'admin' && loggedInUser.id.toString() !== requestedUserId) {
        return res.status(403).json({ message: "Akses ditolak" });
    }
    
    try {
        const [results] = await db.query('SELECT id, nama, username, email, role, image FROM user WHERE id = ?', [requestedUserId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// [POST] / - Membuat user baru (Registrasi)
router.post('/', async (req, res) => {
    const { nama, username, passwd, email, role } = req.body;
    if (!nama || !username || !passwd || !email || !role) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(passwd, 10);
        const query = 'INSERT INTO user (nama, username, passwd, email, role) VALUES (?, ?, ?, ?, ?)';
        const values = [nama.trim(), username.trim(), hashedPassword, email.trim(), role.trim()];

        const [results] = await db.query(query, values);

        const newUser = {
            id: results.insertId,
            nama: nama.trim(),
            username: username.trim(),
            email: email.trim(),
            role: role.trim()
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

router.put('/:id', [authMiddleware, upload.single('profileImage')], async (req, res) => {
    const loggedInUser = req.user;
    const requestedUserId = req.params.id;

    if (loggedInUser.role !== 'admin' && loggedInUser.id.toString() !== requestedUserId) {
        return res.status(403).json({ message: "Akses ditolak" });
    }

    const { nama, username, passwd, email, role } = req.body;
    
    if (loggedInUser.role !== 'admin' && role) {
        return res.status(403).json({ message: 'Anda tidak bisa mengubah role.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM user WHERE id = ?', [requestedUserId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        const user = users[0];
        let hashedPassword = user.passwd;
        if (passwd) {
            // Jika ada password baru yang dikirim, hash password tersebut
            hashedPassword = await bcrypt.hash(passwd, 10);
        }

        let newImageFilename = user.image;
        if (req.file) {
            // Jika ada file baru yang diupload
            newImageFilename = req.file.filename;

            // Hapus gambar lama jika ada
            if (user.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', 'avatar_user', user.image);
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    // Abaikan error jika file tidak ditemukan, tapi log untuk anomali
                    console.warn(`Gagal menghapus gambar lama: ${oldImagePath}`, err.message);
                }
            }
        }

        // 3. Update database
        const query = `
            UPDATE user SET 
                nama = ?, 
                username = ?, 
                email = ?, 
                role = ?,
                passwd = ?,
                image = ?
            WHERE id = ?
        `;
        const values = [
            nama || user.nama,
            username || user.username,
            email || user.email,
            loggedInUser.role === 'admin' ? (role || user.role) : user.role,
            requestedUserId,
            hashedPassword,
            newImageFilename,
        ];

        await db.query(query, values);
        
        // 4. Ambil data terbaru dan kirim sebagai respons
        const [updatedUsers] = await db.query('SELECT id, nama, username, email, role, image FROM user WHERE id = ?', [id]);

        res.json({
            message: "Profil berhasil diperbarui!",
            user: updatedUsers[0]
        });

    } catch (error) {
        console.error('Database error on update user:', error);
        // Hapus file yang baru diupload jika terjadi error database
        if (req.file) {
            const uploadedPath = path.join(__dirname, '..', 'uploads', 'avatar_user', req.file.filename);
            await fs.unlink(uploadedPath).catch(err => console.warn('Gagal cleanup file upload:', err.message));
        }
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ message: 'Username atau Email sudah digunakan oleh user lain.' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// [DELETE] /:id - Menghapus user
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        // Sebelum menghapus user, hapus file gambar terkait jika ada
        const [users] = await db.query('SELECT image FROM user WHERE id = ?', [req.params.id]);
        if (users.length > 0 && users[0].image) {
             const imagePath = path.join(__dirname, '..', 'uploads', 'avatar_user', users[0].image);
             try {
                await fs.unlink(imagePath);
             } catch(err) {
                console.warn(`Gagal menghapus gambar untuk user ID ${req.params.id}:`, err.message);
             }
        }
        const [results] = await db.query('DELETE FROM user WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        // Status 204 (No Content) adalah standar untuk delete yang berhasil
        res.status(204).send();
    } catch (error) {
        console.error('Database error on delete user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// [POST] /login - Proses Login User
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
                id: user.id,
                name: user.nama,
                username: user.username,
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Hanya export router, karena semua logika sudah ada di dalam router ini
module.exports = router;
