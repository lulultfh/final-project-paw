const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token tidak ada" });

  const token = authHeader.split(" ")[1]; // format: Bearer <token>
  if (!token) return res.status(401).json({ message: "Token salah format" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user; 
    next();
  });
}

module.exports = authMiddleware;
