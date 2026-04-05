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
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat pt-24"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8 text-white">
            <span className="inline-flex rounded-full bg-blue-400/20 px-4 py-2 text-xs tracking-[0.35em] text-blue-100 uppercase shadow-sm">
              Premium Travel Planning
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Plan your next trip with clarity, speed, and style.
              </h1>
              <p className="max-w-2xl text-lg text-slate-200/90 sm:text-xl">
                Build a complete itinerary, from stays and transport to food recommendations and day-by-day plans — all optimized for your destination and budget.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Smart insights</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Local travel tips</h3>
                <p className="mt-2 text-slate-300">Recommendations that make your itinerary feel custom-built.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Modern timing</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Realistic daily plans</h3>
                <p className="mt-2 text-slate-300">Each day is balanced with travel, meals, and experiences.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Smart budget</p>
                <h3 className="mt-3 text-xl font-semibold text-white">INR cost estimates</h3>
                <p className="mt-2 text-slate-300">Know what to expect before you commit to the plan.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Group ready</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Designed for groups</h3>
                <p className="mt-2 text-slate-300">Customize your trip with friends or family in mind.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/20 bg-white/90 p-8 shadow-2xl shadow-slate-950/15 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step {step} of 2</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Share your travel details</h2>
              <p className="mt-3 text-slate-600">Complete the form below and generate a ready-to-use itinerary.</p>
            </div>

            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
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

                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

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
                  placeholder="Special requests (diet, accessibility, activities...)"
                />

                <Button type="submit" className="w-full bg-blue-600 text-white py-4 text-xl hover:bg-blue-700">
                  Continue to Preferences
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Budget</label>
                  <select
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="mid-range">Comfortable</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Group Size</label>
                  <div className="flex max-w-xs items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          groupSize: Math.max(1, prev.groupSize - 1)
                        }))
                      }
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-slate-900">{formData.groupSize}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          groupSize: prev.groupSize + 1
                        }))
                      }
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Your Interests</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {interestOptions.map(i => {
                      const selected = formData.interests.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleInterestToggle(i)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selected ? 'border-purple-600 bg-purple-600 text-white shadow-md' : 'border-slate-300 bg-white text-slate-700 hover:border-purple-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-200'}`}
                        >
                          {selected ? '✓ ' : ''}
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-purple-600 text-white py-4 text-xl hover:bg-purple-700">
                  Generate Itinerary
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}