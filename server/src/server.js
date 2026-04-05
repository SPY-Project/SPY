import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import verifyToken from "./middleware/verifyToken.js";
import Itinerary from "./models/Itinerary.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));

// MongoDB Connection (optional - auth works without it for now)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));
} else {
  console.log("⚠️  MongoDB not configured. Auth will work but itineraries won't be saved.");
}

// Auth routes (public)
app.use("/api/auth", authRouter);

// Protected: Generate Itinerary
app.post("/generate-itinerary", verifyToken, async (req, res) => {
  try {
    console.log("🔵 Generate Itinerary Request");
    console.log("User ID:", req.userId);
    console.log("Token header present:", !!req.headers.authorization);
    
    const data = req.body;

const prompt = `
You are a professional travel planner.

Generate a COMPLETE, DETAILED, DAY-BY-DAY travel itinerary in STRICT JSON format.
Currency must ALWAYS be INR.

IMPORTANT: Timings must be REALISTIC and DIFFERENT for EACH DAY.
DO NOT reuse the same time slots across different days.

INPUT:
${JSON.stringify(data)}

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "summary": {
    "travelerName": "",
    "fromLocation": "",
    "destination": "",
    "durationDays": "",
    "tripDates": "",
    "budgetCategory": "",
    "groupSize": "",
    "totalEstimatedCostINR": "",
    "bestTimeToVisit": "",
    "weatherTips": ""
  },
  "stay": {
    "hotelName": "",
    "hotelAddress": "",
    "pricePerNightINR": "",
    "totalHotelCostINR": "",
    "whyThisHotel": ""
  },
  "travel": {
    "mode": "",
    "ticketDetails": "",
    "costINR": "",
    "travelTips": ""
  },
  "dayWisePlan": [
    {
      "day": 1,
      "date": "",
      "activities": [
        {
          "time": "",
          "title": "",
          "details": "",
          "costINR": "",
          "insight": ""
        }
      ]
    }
  ],
  "foodRecommendations": [
    {
      "restaurant": "",
      "type": "",
      "approxCostINR": "",
      "mustTry": ""
    }
  ],
  "valuableInsights": {
    "localTransportTips": "",
    "moneySavingTips": "",
    "safetyTips": "",
    "shoppingTips": "",
    "avoidTheseMistakes": ""
  }
}

TIMING RULES (CRITICAL):
- Each day MUST have DIFFERENT time schedules.
- Day start time must vary between 6:00 AM – 8:30 AM.
- Lunch time must vary between 12:30 PM – 2:30 PM.
- Evening activities must vary between 4:30 PM – 7:00 PM.
- Dinner time must vary between 7:30 PM – 10:00 PM.
- DO NOT repeat identical time values across days.
- Activity durations must feel natural (not uniform).

GENERAL RULES:
- Every day must cover morning to night.
- Always include breakfast, sightseeing, lunch, rest, local travel, and dinner.
- Activities must have time + realistic INR cost.
- IMPORTANT: Keep costs BUDGET-FRIENDLY and REASONABLE. Use approximately 20-30% lower than typical tourist prices to make it affordable.
- Adjust pacing and costs based on groupSize and trip duration.
- Use ONLY places from the destination city.
- Keep JSON 100% VALID.
- No markdown, no comments, no extra text.
`;


  

    // Call OpenRouter API directly
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',   // You can switch to gpt-4.1 if needed
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

  const result = await response.json();
  // console.log("OpenRouter response → ", result);
  if (!result.choices || !result.choices.length) {
  console.error("OpenRouter error:", result);
  return res.status(500).json({
    error: "AI response invalid",
    details: result
  });
}

const rawContent = result.choices[0].message.content;

const cleanContent = rawContent
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

const itineraryData = JSON.parse(cleanContent);

// Save itinerary to database
let saved = false;
try {
  console.log("Attempting to save itinerary for userId:", req.userId);
  const newItinerary = new Itinerary({
    userId: req.userId,
    formData: req.body,
    itinerary: itineraryData
  });
  await newItinerary.save();
  console.log("✅ Itinerary saved successfully");
  saved = true;
} catch (dbErr) {
  console.error("❌ Save error:", dbErr.message);
  console.error("Full error:", dbErr);
}

res.json({
  ...itineraryData,
  saved
});


  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

// Get user itinerary history (saved trips)
app.get("/itinerary-history", verifyToken, async (req, res) => {
  try {
    const history = await Itinerary.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch itinerary history" });
  }
});

// Delete a saved itinerary
app.delete("/itinerary/:id", verifyToken, async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const deletedItinerary = await Itinerary.findOneAndDelete({
      _id: itineraryId,
      userId: req.userId // Ensure user can only delete their own itineraries
    });

    if (!deletedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    res.json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
