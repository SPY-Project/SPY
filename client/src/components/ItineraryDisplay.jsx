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
    <div className="max-w-4xl mx-auto">

      {/* Save Status Banner */}
      {!itinerary.saved && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
          <p className="text-yellow-800">
            <strong>Note:</strong> You're viewing this itinerary as a guest. Log in to save it to your history.
          </p>
        </div>
      )}

      {itinerary.saved && (
        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded">
          <p className="text-green-800">
            <strong>✓ Saved!</strong> This itinerary has been saved to your history.
          </p>
        </div>
      )}

      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
        <h1 className="text-2xl mb-2">Hi, {formData.travelerName || "Traveler"}!</h1>

        <h2 className="text-4xl font-bold mb-4">
          {itinerary.summary.destination} Itinerary
        </h2>

        <p className="text-xl mb-2">{days} Days {nights} Nights</p>
        {itinerary.summary.totalEstimatedCostINR && (
          <p className="text-lg mb-6 text-blue-200">
            Total Estimated Budget: ₹{itinerary.summary.totalEstimatedCostINR.toLocaleString()}
          </p>
        )}

        <div className="flex gap-4">
          <Button onClick={onDownloadPDF} className="bg-purple-700 text-white font-semibold flex gap-2 px-6 py-3">
            <Download /> Download PDF
          </Button>
          
          <Button onClick={onStartOver} className="bg-gray-200 flex gap-2">
            <ArrowLeft /> Start Over
          </Button>
        </div>
      </Card>

      {/* Trip Info */}
      <Card className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">

          <div>
            <p className="text-sm text-gray-500 mb-1">From</p>
            <p className="font-semibold">{formData.fromLocation}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Departure</p>
            <p className="font-semibold">{format(startDate, "dd/MM/yyyy")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Arrival</p>
            <p className="font-semibold">{format(endDate, "dd/MM/yyyy")}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Destination</p>
            <p className="font-semibold">{itinerary.summary.destination}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Travellers</p>
            <p className="font-semibold">{formData.groupSize}</p>
          </div>
        </div>
      </Card>

      {/* Days */}
      <div className="space-y-6">
        {itinerary.dayWisePlan.map((day, index) => (
          <Card key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="flex items-center p-6">

              {/* Day Image */}
              {/* <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mr-6">
                <img
                  src={getDestinationImage(itinerary.summary.destination)}
                  alt="destination"
                  className="w-full h-full object-cover"
                />
              </div> */}

              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center mr-6 text-white text-sm font-semibold shadow-xl animate-pulse">
  ✈️ Trip
</div>


              <div>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">Day {day.day}</h3>

                {/* Activities */}
                {day.activities?.length > 0 && (
                  <ul className="mt-2 list-disc ml-4">
                    {day.activities.map((act, i) => (
                      <li key={i} className="text-gray-700">
                        {act.time ? `${act.time} - ` : ""}
                        {act.title}
                        {act.costINR && (
                          <span className="text-green-600 font-medium ml-2">
                            ({act.costINR})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Transfers */}
                {day.transfers?.length > 0 && (
                  <ul className="mt-3 list-disc ml-4">
                    {day.transfers.map((t, i) => (
                      <li key={i} className="text-blue-700">
                        {t.type} – {t.time} – {t.price}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Per Day Budget */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-semibold">
                    Estimated Daily Budget: ₹{calculateDayTotal(day).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
