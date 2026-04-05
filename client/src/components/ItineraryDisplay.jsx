import React from "react";
import { Download, ArrowLeft } from "lucide-react";
// import { getDestinationImage } from "../utils/destinationImages";
import { format, parseISO, differenceInDays } from "date-fns";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ItineraryDisplay = ({ itinerary, formData, onDownloadPDF, onStartOver }) => {

  // Function to parse cost from string like "500 INR"
  const parseCost = (costStr) => {
    if (!costStr) return 0;
    const match = costStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Function to calculate total cost for a day
  const calculateDayTotal = (day) => {
    let total = 0;
    if (day.activities) {
      total += day.activities.reduce((sum, act) => sum + parseCost(act.costINR), 0);
    }
    if (day.transfers) {
      total += day.transfers.reduce((sum, transfer) => sum + parseCost(transfer.price), 0);
    }
    return total;
  };

  // SAFETY CHECKS
  if (!itinerary || typeof itinerary !== "object") {
    return <p className="text-center text-red-500">Loading itinerary...</p>;
  }

  // Check required backend keys
  if (!itinerary.summary || !Array.isArray(itinerary.dayWisePlan)) {
    return <p className="text-center text-red-500">Incomplete itinerary data.</p>;
  }

  const startDate = parseISO(formData.startDate);
  const endDate = parseISO(formData.endDate);
  const nights = differenceInDays(endDate, startDate);
  const days = nights + 1;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/10">
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-600 p-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200">Itinerary complete</p>
              <h1 className="text-4xl font-bold tracking-tight">Your custom {itinerary.summary.destination} plan is ready</h1>
              <p className="max-w-2xl text-slate-100 text-lg leading-relaxed">
                This itinerary is built from your travel preferences, dates, and budget. Review the daily plan, download your PDF, or start over when you're ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Days</p>
                <p className="mt-3 text-3xl font-semibold">{days}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Budget</p>
                <p className="mt-3 text-3xl font-semibold">₹{itinerary.summary.totalEstimatedCostINR?.toLocaleString() || "TBD"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 lg:p-12">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <Card className="rounded-3xl p-6 shadow-xl border border-slate-100">
                <h2 className="text-2xl font-semibold mb-4">Trip overview</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Traveler</p>
                    <p className="font-semibold mt-2">{formData.travelerName || "Traveler"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Dates</p>
                    <p className="font-semibold mt-2">{format(startDate, "dd MMM yyyy")} – {format(endDate, "dd MMM yyyy")}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Destination</p>
                    <p className="font-semibold mt-2">{itinerary.summary.destination}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Group size</p>
                    <p className="font-semibold mt-2">{formData.groupSize}</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl p-6 shadow-xl border border-slate-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Ready to share</p>
                    <h3 className="text-xl font-semibold">Download or edit</h3>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={onDownloadPDF} className="bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 px-5 py-3">
                      <Download /> Download PDF
                    </Button>
                    <Button onClick={onStartOver} className="bg-slate-100 text-slate-900 font-semibold flex items-center justify-center gap-2 px-5 py-3">
                      <ArrowLeft /> Start Over
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Highlights</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Trip type</p>
                  <p className="mt-2 text-lg font-semibold">{formData.travelStyle || "Custom Adventure"}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Budget goal</p>
                  <p className="mt-2 text-lg font-semibold">₹{formData.budget || "Flexible"}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Must-do</p>
                  <p className="mt-2 text-lg font-semibold">{formData.highlights || "Local experiences"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {itinerary.dayWisePlan.map((day, index) => (
              <Card key={index} className="rounded-3xl border border-slate-100 overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6 text-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-200">Day {day.day}</p>
                    <h3 className="text-2xl font-semibold">{day.title || `Explore ${itinerary.summary.destination}`}</h3>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-2 text-slate-100 text-sm font-medium">
                    ₹{calculateDayTotal(day).toLocaleString()} estimate
                  </div>
                </div>

                <div className="bg-white p-6">
                  {day.activities?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">Activities</h4>
                      <ul className="space-y-3">
                        {day.activities.map((act, i) => (
                          <li key={i} className="rounded-3xl border border-slate-200 p-4">
                            <p className="font-semibold text-slate-900">{act.title}</p>
                            {act.time && <p className="text-sm text-slate-500">{act.time}</p>}
                            {act.costINR && <p className="mt-2 text-sm text-emerald-600 font-semibold">{act.costINR}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {day.transfers?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">Transfers</h4>
                      <ul className="space-y-2 text-slate-700">
                        {day.transfers.map((t, i) => (
                          <li key={i} className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                            <p className="font-medium">{t.type}</p>
                            <p className="text-sm text-slate-500">{t.time} · {t.price}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
