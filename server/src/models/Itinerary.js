import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    formData: {
      travelerName: String,
      fromLocation: String,
      destination: String,
      startDate: Date,
      endDate: Date,
      durationDays: Number,
      budgetCategory: String,
      groupSize: String,
    },
    itinerary: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
