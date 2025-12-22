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

    // console.log("Request received → ", data);

    const prompt = `
Generate a complete travel itinerary in JSON.
Currency should ALWAYS be INR.

INPUT:
${JSON.stringify(data)}

OUTPUT FORMAT:
{
  "summary": {
    "travelerName": "",
    "fromLocation": "",
    "destination": "",
    "durationDays": "",
    "tripDates": "",
    "budgetCategory": "",
    "groupSize": "",
    "totalEstimatedCostINR": ""
  },
  "stay": {
    "hotelName": "",
    "hotelAddress": "",
    "pricePerNightINR": "",
    "totalHotelCostINR": ""
  },
  "travel": {
    "mode": "",
    "ticketDetails": "",
    "costINR": ""
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
          "costINR": ""
        }
      ]
    }
  ],
  "foodRecommendations": [
    {
      "restaurant": "",
      "type": "",
      "approxCostINR": ""
    }
  ]
}

Rules:
- Always generate a full itinerary even if trip is only 1 day.
- Always include: breakfast, sightseeing, local travel, dinner.
- Activities must have time + cost.
- Costs must be realistic INR amounts.
- Always use the destination provided in INPUT.
- Keep the JSON VALID. No comments, no text outside JSON.
    `;

    // Call OpenRouter API directly
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Referer": "http://localhost:5173", 
  "X-Title": "Travel Planner"
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',   // You can switch to gpt-4.1 if needed
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const result = await response.json();
const rawContent = result.choices?.[0]?.message?.content || "";



// Clean the AI output to make it valid JSON
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
