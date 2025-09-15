const express = require("express");
const path = require('path'); 
const cors = require("cors");
const productRoutes = require("./infrastructure/routes/product-db");
const userRoutes = require("./infrastructure/routes/user-db");
const orderRoutes = require("./infrastructure/routes/order-db");
const orderItemRoutes = require("./infrastructure/routes/order-item-db");
const cartRoutes = require("./infrastructure/routes/cart-db"); 
const multer = require('multer');
const upload = multer({ dest: './uploads/avatar_user/' });

const app = express();

// static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/order-item", orderItemRoutes);
app.use("/api/cart", cartRoutes);
// app.use('/api/users', userRoutes);

module.exports = app;
