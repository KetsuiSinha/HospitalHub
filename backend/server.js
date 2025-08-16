const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authMiddleware = require("./src/middleware/authMiddleware");

dotenv.config();
const app = express();

app.use(express.json());

// DB Connection
connectDB();

// Public Routes (no auth needed)
app.use("/api/auth", require("./src/routes/authRoutes"));

// Protected Routes (all require token)
app.use("/api/medicines", authMiddleware, require("./src/routes/medicineRoutes"));
app.use("/api/inventory", authMiddleware, require("./src/routes/inventoryRoutes"));
app.use("/api/recommendations", authMiddleware, require("./src/routes/recommendationRoutes"));

app.get("/", (req, res) => {
  res.send("Hospital Management API Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
