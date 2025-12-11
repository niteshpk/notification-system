import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import configRoutes from "./routes/configRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Notification System API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
