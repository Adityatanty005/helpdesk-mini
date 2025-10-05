import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rate limit: 60 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: { code: "RATE_LIMIT" } },
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
// Mount comment routes under /api/tickets so endpoints like
// POST /api/tickets/:id/comments are handled by commentRoutes
app.use("/api/tickets", commentRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
