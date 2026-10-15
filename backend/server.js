require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Blood Connect API is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Blood Connect server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();