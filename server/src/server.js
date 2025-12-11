import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import itineraryRoutes from "./routes/itineraries.js";
import { notFound , errorHandler} from "./utils/errorHandler.js";
// Load env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/itineraries", itineraryRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Travel Itinerary API Running");
});

// Not Found handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
