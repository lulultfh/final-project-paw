const express = require("express");
const path = require('path'); 
const cors = require("cors");
const productRoutes = require("./infrastructure/routes/product-db");
const userRoutes = require("./infrastructure/routes/user-db")
const orderRoutes = require("./infrastructure/routes/order-db")
const orderItemRoutes = require("./infrastructure/routes/order-item-db")
const cartRoutes = require("./infrastructure/routes/cart-db"); 
const upload = multer({ dest: './uploads/avatar_user/' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/order-item", orderItemRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/users', userDb);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
