import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TravelForm from "./components/TravelForm";
import ItineraryDisplay from "./components/ItineraryDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginModal from "./components/LoginModal";
import { generateItinerary } from "./utils/itineraryGenerator";
import { generatePDF } from "./utils/pdfGenerator";
import { TravelFormData, GeneratedItinerary } from "./types/travel";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "loading" | "itinerary">("form");

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [travelFormData, setTravelFormData] = useState<TravelFormData | null>(null);

const handleFormSubmit = async (formData: TravelFormData) => {
  setTravelFormData(formData);
  setCurrentStep('loading');

  // Optional delay — you can remove this
  await new Promise(resolve => setTimeout(resolve, 1000));

  const generatedItinerary = await generateItinerary(formData);

  setItinerary(generatedItinerary);
  setCurrentStep('itinerary');
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

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (!confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/itinerary/${itineraryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete itinerary");
      }

      // Remove from local state
      setHistory(history.filter(item => item._id !== itineraryId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete itinerary. Please try again.");
    }
  };

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setHistoryLoading(true);
    fetch("http://localhost:5000/itinerary-history", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load history");
        return res.json();
      })
      .then((data) => setHistory(data))
      .catch((err) => {
        console.error("History load error:", err);
        setHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoginClick={() => setShowLoginModal(true)} />

      <main className="container mx-auto px-4 py-8">
        {currentStep === "form" && <TravelForm onSubmit={handleFormSubmit} />}
        {currentStep === "loading" && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
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

      {user && (
        <section id="history" className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Your Saved Itinerary History</h3>
            {historyLoading ? (
              <p>Loading history...</p>
            ) : history.length === 0 ? (
              <p>No saved itineraries yet. Generate one to save it.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((item) => (
                  <li key={item._id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.formData.destination || "No destination"}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setItinerary({ ...item.itinerary, saved: true });
                            setTravelFormData(item.formData || null);
                            setCurrentStep("itinerary");
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteItinerary(item._id)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          title="Delete itinerary"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <Footer />
      </div>
    );
  }

export default App;
