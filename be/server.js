const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product-db");
const userRoutes = require("./routes/user-db")
const orderRoutes = require("./routes/order-db")

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
