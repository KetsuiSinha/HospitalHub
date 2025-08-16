const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
const app = express();

app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/medicines", require("./src/routes/medicineRoutes"));
app.use("/api/inventory", require("./src/routes/inventoryRoutes"));
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));

app.get("/", (req, res) => {
  res.send("Hospital Management API Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
