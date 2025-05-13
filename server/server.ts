import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
