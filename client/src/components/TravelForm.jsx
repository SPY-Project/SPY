import React, { useState } from "react";
import { Calendar, MapPin, DollarSign, Users, Heart, Home, Car, MessageSquare, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

const initialFormData = {
  travelerName: "",
  fromLocation: "",
  destination: "",
  startDate: "",
  endDate: "",
  budget: "mid-range",
  groupSize: 1,
  interests: [],
  accommodationType: "hotel",
  transportMode: "train",
  specialRequests: ""
};

export default function TravelForm({ onSubmit }) {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(1);


  const interestOptions = [
    "culture", "food", "adventure", "relaxation",
    "nightlife", "shopping", "nature", "photography"
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.fromLocation || !formData.destination || !formData.startDate || !formData.endDate) {
      alert("Please fill required fields.");
      return;
    }
    setStep(2);
  };
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const cleanData = {
      travelerName: formData.travelerName.trim().replace(/^./, str => str.toUpperCase()),
      fromLocation: formData.fromLocation.trim(),
      destination: formData.destination.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      groupSize: Number(formData.groupSize),
      interests: formData.interests.length ? formData.interests : ["sightseeing"],
      accommodationType: formData.accommodationType,
      transportMode: formData.transportMode,
      specialRequests: formData.specialRequests.trim() || "none"
    };

    console.log("FINAL CLEAN DATA →", cleanData);
    onSubmit(cleanData);
  };



  return (
    <section
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: "url('/travel1.png')" }}
    >
      {/* Overlay for readability */}
      <div className="w-full min-h-full bg-black/40 flex items-center">

        {/* Content container */}
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <p className="text-center text-sm text-gray-300 mb-2">
            Step {step} of 2
          </p>



          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Plan Your Perfect Journey
          </h2>

          <p className="text-center text-gray-200 mb-10 max-w-2xl mx-auto">
            Smart, Personalized travel planning tailored just for you
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <Card className="p-8 space-y-8 bg-white/90 backdrop-blur-lg shadow-2xl">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.travelerName}
                    onChange={e => setFormData({ ...formData, travelerName: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="From Location"
                    required
                    value={formData.fromLocation}
                    onChange={e => setFormData({ ...formData, fromLocation: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Destination"
                    required
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input
                    type="date"
                    icon={<Calendar size={18} />}
                    min={today}
                    value={formData.startDate}
                    className="text-base"
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        startDate: e.target.value,
                        endDate: ""
                      }))
                    }
                  />

                  <Input
                    type="date"
                    icon={<Calendar size={18} />}
                    className="text-base"
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))
                    }
                  />

                  {/* SPECIAL REQUESTS */}
                  <Input
                    type="textarea"
                    value={formData.specialRequests}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        specialRequests: e.target.value
                      }))
                    }
                    className="h-32 resize-none"
                    placeholder="Any dietary requirements, accessibility needs, or special activities..."
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white py-4 text-xl">
                  Next <ArrowRight className="inline ml-2" />
                </Button>

              </Card>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit}>
              <Card className="p-8 space-y-8 bg-white/90 backdrop-blur-lg shadow-2xl">

                <div>
                  <label>Budget</label>
                  <select
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="mid-range">Comfortable</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Group Size</label>

                  <div className="w-full p-3 border rounded-lg items-center flex justify-between max-w-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          groupSize: Math.max(1, prev.groupSize - 1)
                        }))
                      }
                      className="px-3 py-1 border rounded"
                    >
                      −
                    </button>

                    <span className="text-lg font-semibold">
                      {formData.groupSize}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          groupSize: prev.groupSize + 1
                        }))
                      }
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                </div>
                <div>
                  <label className="block mb-2 font-medium">Your Interests</label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestOptions.map(i => {
                      const selected = formData.interests.includes(i);

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleInterestToggle(i)}
                          className={`
            capitalize px-4 py-2 rounded-lg border transition-all
            flex items-center justify-center gap-2
            ${selected
                              ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}
          `}
                        >
                          {selected && "✓"}
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>


                <Button type="submit" className="w-full bg-green-600 text-white py-4 text-xl">
                  Generate Itinerary
                </Button>

              </Card>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}