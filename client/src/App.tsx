import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TravelForm from "./components/TravelForm";
import ItineraryDisplay from "./components/ItineraryDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import { generateItinerary } from "./utils/itineraryGenerator";
import { generatePDF } from "./utils/pdfGenerator";
import { TravelFormData, GeneratedItinerary } from "./types/travel";

function App() {
  const [currentStep, setCurrentStep] = useState<"form" | "loading" | "itinerary">("form");

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);

  const [travelFormData, setTravelFormData] = useState<TravelFormData | null>(null);

  const handleFormSubmit = async (formData: TravelFormData) => {
    setTravelFormData(formData);
    setCurrentStep("loading");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedItinerary = generateItinerary(formData);
    setItinerary(generatedItinerary);
    setCurrentStep("itinerary");
  };

  const handleDownloadPDF = async () => {
    if (itinerary && travelFormData) {
      await generatePDF(itinerary, travelFormData.fromLocation);
    }
  };

  const handleStartOver = () => {
    setCurrentStep("form");
    setItinerary(null);
    setTravelFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {currentStep === "form" && <TravelForm onSubmit={handleFormSubmit} />}

        {currentStep === "loading" && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <LoadingSpinner />
          </div>
        )}

        {currentStep === "itinerary" && itinerary && travelFormData && (
          <ItineraryDisplay
            itinerary={itinerary}
            formData={travelFormData}
            onDownloadPDF={handleDownloadPDF}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
