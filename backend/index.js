import express from "express";
import symptomsPrediction from "./routes/symptomsPrediction.route.js";
import cors from "cors";

const app = express();
app.use(cors()); // For dev, allow all

// import authRoutes from "./routes/auth.js";

// Middleware
app.use(express.json());

// Routes
// app.use("/auth", authRoutes); // Uncomment if needed
app.use("/api", symptomsPrediction);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
