import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Make sure to install node-fetch: npm install node-fetch

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.post("/generate-itinerary", async (req, res) => {
  try {
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

res.json(JSON.parse(cleanContent));


  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
