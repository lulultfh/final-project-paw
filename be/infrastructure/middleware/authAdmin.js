

function adminMiddleware(req, res, next) {
  // Middleware ini harus dijalankan SETELAH authMiddleware
  const user = req.user;

  if (user && user.role === 'admin') {
    // Jika user ada dan rolenya 'admin', lanjutkan ke controller
    next();
  } else {
    // Jika bukan admin, kirim pesan error
    res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
  }
}

module.exports = adminMiddleware;