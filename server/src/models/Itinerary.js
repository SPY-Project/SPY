import mongoose from 'mongoose';
const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number },
  title: { type: String },
  activities: [{ type: String }]
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  name: String,        // e.g., "Panaji" or "Taj Mahal"
  city: String,
  country: String,
  lat: Number,
  lng: Number,
  notes: String
}, { _id: false });

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  days: [DaySchema],
  locations: [LocationSchema],
  createdBy: { type: String }, // optional placeholder (could be userId later)
  tags: [String],
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
export default Itinerary;
