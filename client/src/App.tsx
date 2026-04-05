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
  const [showTravelForm, setShowTravelForm] = useState(false);
  const [pageHistory, setPageHistory] = useState<string[]>([]);

  const handleOpenTravelForm = () => {
    setPageHistory((prev) => [...prev, "landing"]);
    setShowTravelForm(true);
  };

  const handleBack = () => {
    if (pageHistory.length > 0) {
      setPageHistory((prev) => {
        const lastPage = prev[prev.length - 1];
        const nextHistory = prev.slice(0, -1);

        switch (lastPage) {
          case "landing":
            setShowTravelForm(false);
            break;
          case "form":
          case "history":
            setCurrentStep("form");
            break;
          default:
            break;
        }

        return nextHistory;
      });
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }

    if (showTravelForm) {
      setShowTravelForm(false);
    } else {
      setCurrentStep("form");
    }
  };

  const handleFormSubmit = async (formData: TravelFormData) => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setPageHistory((prev) => [...prev, "form"]);
    setTravelFormData(formData);
    setCurrentStep("loading");

    // Optional delay — you can remove this
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const generatedItinerary = await generateItinerary(formData);

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
    setPageHistory([]);
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

  const showBack = user || showTravelForm;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  const anchorSections = (
    <>
      <section id="destinations" className="scroll-mt-28 bg-slate-950 py-20 px-4 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Top destinations</p>
            <h2 className="text-4xl font-semibold mt-4">Explore popular destinations</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">Choose your destination and let SPY craft an itinerary that fits your travel style perfectly.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-white/10">
              <div className="relative h-56 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <span className="inline-block text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Europe</span>
                <h3 className="text-3xl font-semibold mb-3">Paris</h3>
                <p className="text-slate-300 mb-4">Romantic boulevards, iconic museums, and unforgettable dining experiences.</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/20 px-3 py-1">Art & Culture</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">Foodie Trails</span>
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-white/10">
              <div className="relative h-56 bg-[url('https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <span className="inline-block text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Asia</span>
                <h3 className="text-3xl font-semibold mb-3">Tokyo</h3>
                <p className="text-slate-300 mb-4">Neon districts, gourmet discovery, and a perfect blend of tradition and futurism.</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/20 px-3 py-1">Urban Escape</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">Night Markets</span>
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-white/10">
              <div className="relative h-56 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <span className="inline-block text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">India</span>
                <h3 className="text-3xl font-semibold mb-3">Goa</h3>
                <p className="text-slate-300 mb-4">Relaxed beach days, coastal cuisine, and a vibrant mix of culture and nightlife.</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/20 px-3 py-1">Beach Life</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">Sunset Cruises</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiences" className="scroll-mt-28 bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Travel experiences</p>
            <h2 className="text-4xl font-semibold mt-4 text-slate-900">Built around what you love</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">Select the kind of adventure you want, and SPY will make it part of your itinerary.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Culture</h3>
              <p className="text-slate-600 mb-5">Enjoy museum tours, heritage walks, curated art experiences, and local storytelling sessions.</p>
              <ul className="space-y-3 text-slate-500">
                <li>Historic tours</li>
                <li>Local cuisine tastings</li>
                <li>Nighttime city strolls</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Adventure</h3>
              <p className="text-slate-600 mb-5">Design high-energy days with hikes, water sports, outdoor treks, and bucket-list activities.</p>
              <ul className="space-y-3 text-slate-500">
                <li>Guided trails</li>
                <li>Water adventures</li>
                <li>Scenic viewpoints</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Relaxation</h3>
              <p className="text-slate-600 mb-5">Create calm itineraries with spa time, slow mornings, beachside stays, and restful pacing.</p>
              <ul className="space-y-3 text-slate-500">
                <li>Spa and wellness</li>
                <li>Sunset lounges</li>
                <li>Serene retreat days</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 rounded-3xl bg-slate-950 p-10 text-white shadow-2xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Traveler review</p>
                <h3 className="text-3xl font-semibold mt-4">“SPY turned our vacation from ordinary to unforgettable.”</h3>
                <p className="mt-3 text-slate-300 max-w-2xl">The personalized itinerary matched our pace and helped us discover hidden neighborhoods, amazing food, and unforgettable experiences.</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-6 py-5 text-slate-100 shadow-lg">
                <p className="text-xl font-semibold">Anjali R.</p>
                <p className="text-slate-400">January 2026</p>
                <div className="mt-4 flex items-center gap-2 text-amber-300">
                  <span>★★★★★</span>
                  <span className="text-slate-300">5.0 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Show landing page if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 to-purple-50 scroll-smooth antialiased">
        <Header onLoginClick={() => setShowLoginModal(true)} showBack={showBack} onBack={handleBack} />

        {/* Show Travel Form if requested */}
        {showTravelForm ? (
          <main className="container mx-auto px-4 py-8">
            <TravelForm onSubmit={handleFormSubmit} />
          </main>
        ) : (
          <>
            {/* Landing Page */}
            <main className="relative">
              {/* Hero Section with Travel Image */}
              <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                    alt="Beautiful travel destination"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Discover Your Next
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Adventure
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                    Plan perfect trips with AI-powered itineraries tailored just for you
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleOpenTravelForm}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      Start Planning Your Trip
                    </button>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Join thousands of happy travelers
                    </p>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
                    Why Choose SPY?
                  </h2>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-Powered Planning</h3>
                      <p className="text-gray-600">Get personalized travel itineraries in seconds with our advanced AI technology</p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Local Insights</h3>
                      <p className="text-gray-600">Discover hidden gems and authentic experiences that locals love</p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Budget Friendly</h3>
                      <p className="text-gray-600">Cost-effective recommendations with transparent pricing in INR</p>
                    </div>
                  </div>
                </div>
              </section>
            </main>

          </>
        )}

        {anchorSections}

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50 scroll-smooth antialiased">
      <Header onLoginClick={() => setShowLoginModal(true)} showBack={showBack} onBack={handleBack} />
      <main className="container mx-auto px-4 py-8">
        {currentStep === "loading" ? (
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl shadow-2xl p-12">
            <div className="flex flex-col items-center justify-center text-center gap-6">
              <div className="rounded-full bg-white/10 p-6 shadow-2xl">
                <LoadingSpinner />
              </div>
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200 mb-4">AI Itinerary Generator</p>
                <h2 className="text-4xl font-bold mb-3">Crafting your perfect journey...</h2>
                <p className="text-blue-100 leading-relaxed">
                  Our AI is analyzing your travel dates, budget, and preferences to design a personalized itinerary. The best experiences are being assembled just for you.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300 mb-2">Step 1</p>
                  <p className="font-semibold text-white">Reviewing your travel profile</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300 mb-2">Step 2</p>
                  <p className="font-semibold text-white">Curating activities & stays</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300 mb-2">Step 3</p>
                  <p className="font-semibold text-white">Finalizing your itinerary</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === "itinerary" && itinerary && travelFormData ? (
          <div className="mb-8">
            <ItineraryDisplay
              itinerary={itinerary}
              formData={travelFormData}
              onDownloadPDF={handleDownloadPDF}
              onStartOver={handleStartOver}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, traveler!</h2>
            <p className="text-gray-600 mb-4">
              Use the form below to generate a fresh itinerary or review your saved trips.
            </p>
            <TravelForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </main>

      {user && (
        <section id="history" className="scroll-mt-28 container mx-auto px-4 py-6">
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
                            setPageHistory((prev) => [...prev, "history"]);
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

      {anchorSections}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Footer />
    </div>
  );
}

export default App;
