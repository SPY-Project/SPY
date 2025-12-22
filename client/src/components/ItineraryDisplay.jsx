import React from "react";
import { Download, ArrowLeft } from "lucide-react";
// import { getDestinationImage } from "../utils/destinationImages";
import { format, parseISO, differenceInDays } from "date-fns";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ItineraryDisplay = ({ itinerary, formData, onDownloadPDF, onStartOver }) => {

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

      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
        <h1 className="text-2xl mb-2">Hi, {formData.travelerName || "Traveler"}!</h1>

        <h2 className="text-4xl font-bold mb-4">
          {itinerary.summary.destination} Itinerary
        </h2>

        <p className="text-xl mb-6">{days} Days {nights} Nights</p>

        <div className="flex gap-4">
          {/* <Button onClick={onDownloadPDF} className="bg-white text-purple-700 flex gap-2">
            <Download /> Download PDF
          </Button> */}
          
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
                        {act.title} {/* FIXED */}
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

              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
