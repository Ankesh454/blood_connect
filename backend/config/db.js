const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGODB_URL;

        if (!mongoURL) {
            throw new Error("MONGODB_URL is missing in the .env file");
        }

        await mongoose.connect(mongoURL);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;