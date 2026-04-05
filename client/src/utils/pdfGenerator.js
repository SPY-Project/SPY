import jsPDF from "jspdf";

export async function generatePDF(itinerary, fromLocation) {
  if (!itinerary) {
    console.error("No itinerary data provided");
    return;
  }

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
    return total;
  };
  if (!itinerary) {
    console.error("No itinerary data provided");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const lineHeight = 5;

  let yPosition = margin;

  // Helper function to add a new page
  const addNewPage = () => {
    pdf.addPage();
    yPosition = margin;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (neededSpace = 30) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      addNewPage();
    }
  };

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(108, 63, 197);
  pdf.setFont(undefined, "bold");
  pdf.text(
    `${itinerary.summary?.destination || "Travel"} Itinerary`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  yPosition += 12;

  // Basic Info
  pdf.setFontSize(11);
  pdf.setTextColor(52, 73, 94);
  pdf.setFont(undefined, "normal");

  if (itinerary.summary) {
    const summary = itinerary.summary;
    pdf.text(`Traveler: ${summary.travelerName || ""}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Duration: ${summary.durationDays || ""} days`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Budget: ${summary.totalEstimatedCostINR || ""}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Group Size: ${summary.groupSize || ""} people`, margin, yPosition);
    yPosition += 10;
  }

  // Day-wise Plan
  if (Array.isArray(itinerary.dayWisePlan)) {
    for (const day of itinerary.dayWisePlan) {
      checkNewPage(40);

      // Day header
      pdf.setFontSize(14);
      pdf.setTextColor(108, 63, 197);
      pdf.setFont(undefined, "bold");
      pdf.text(`Day ${day.day} - ${day.date || ""}`, margin, yPosition);
      yPosition += lineHeight + 2;

      // Activities
      if (Array.isArray(day.activities)) {
        pdf.setFontSize(10);
        pdf.setTextColor(52, 73, 94);
        pdf.setFont(undefined, "normal");

        for (const activity of day.activities) {
          checkNewPage(10);
          pdf.text(
            `${activity.time || ""} - ${activity.title || ""}`,
            margin + 5,
            yPosition
          );
          yPosition += lineHeight;

          if (activity.details) {
            const details = pdf.splitTextToSize(
              activity.details,
              pageWidth - 2 * margin - 10
            );
            pdf.text(details, margin + 10, yPosition);
            yPosition += details.length * lineHeight;
          }

          if (activity.costINR) {
            pdf.setTextColor(39, 174, 96);
            pdf.text(`Cost: ${activity.costINR}`, margin + 10, yPosition);
            pdf.setTextColor(52, 73, 94);
            yPosition += lineHeight;
          }
        }

        // Per Day Budget
        const dayTotal = calculateDayTotal(day);
        if (dayTotal > 0) {
          checkNewPage(10);
          pdf.setTextColor(39, 174, 96);
          pdf.setFont(undefined, "bold");
          pdf.text(`Estimated Daily Budget: ₹${dayTotal.toLocaleString()}`, margin + 5, yPosition);
          pdf.setTextColor(52, 73, 94);
          pdf.setFont(undefined, "normal");
          yPosition += lineHeight + 2;
        }
      }

      yPosition += 5;
    }
  }

  // Food Recommendations
  checkNewPage(40);
  if (Array.isArray(itinerary.foodRecommendations)) {
    pdf.setFontSize(14);
    pdf.setTextColor(108, 63, 197);
    pdf.setFont(undefined, "bold");
    pdf.text("Food Recommendations", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(52, 73, 94);
    pdf.setFont(undefined, "normal");

    for (const food of itinerary.foodRecommendations) {
      checkNewPage(15);
      pdf.text(
        `${food.restaurant || ""} (${food.type || ""})`,
        margin + 5,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text(`Approx Cost: ${food.approxCostINR || ""}`, margin + 10, yPosition);
      yPosition += lineHeight;
    }
  }

  // Valuable Insights
  checkNewPage(40);
  if (itinerary.valuableInsights) {
    const insights = itinerary.valuableInsights;
    pdf.setFontSize(14);
    pdf.setTextColor(108, 63, 197);
    pdf.setFont(undefined, "bold");
    pdf.text("Travel Tips & Insights", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(52, 73, 94);
    pdf.setFont(undefined, "normal");

    if (insights.localTransportTips) {
      pdf.setFont(undefined, "bold");
      pdf.text("Local Transport:", margin, yPosition);
      pdf.setFont(undefined, "normal");
      yPosition += lineHeight;
      const transport = pdf.splitTextToSize(
        insights.localTransportTips,
        pageWidth - 2 * margin - 5
      );
      pdf.text(transport, margin + 5, yPosition);
      yPosition += transport.length * lineHeight + 3;
    }

    if (insights.moneySavingTips) {
      checkNewPage(20);
      pdf.setFont(undefined, "bold");
      pdf.text("Money Saving Tips:", margin, yPosition);
      pdf.setFont(undefined, "normal");
      yPosition += lineHeight;
      const tips = pdf.splitTextToSize(
        insights.moneySavingTips,
        pageWidth - 2 * margin - 5
      );
      pdf.text(tips, margin + 5, yPosition);
      yPosition += tips.length * lineHeight + 3;
    }

    if (insights.safetyTips) {
      checkNewPage(20);
      pdf.setFont(undefined, "bold");
      pdf.text("Safety Tips:", margin, yPosition);
      pdf.setFont(undefined, "normal");
      yPosition += lineHeight;
      const safety = pdf.splitTextToSize(
        insights.safetyTips,
        pageWidth - 2 * margin - 5
      );
      pdf.text(safety, margin + 5, yPosition);
      yPosition += safety.length * lineHeight;
    }
  }

  // Generate and download PDF
  try {
    const fileName = `${itinerary.summary?.destination || "travel"}-itinerary.pdf`;
    pdf.save(fileName);
    console.log("✅ PDF downloaded successfully:", fileName);
  } catch (error) {
    console.error("PDF download error:", error);
  }
}
