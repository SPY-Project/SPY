import jsPDF from "jspdf";

export async function generatePDF(itinerary, fromLocation) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const cardPadding = 7;
  const cardSpacing = 10;
  const sectionSpacing = 5;
  const cardWidth = pageWidth - 2 * margin;

  // Load logo
  const getLogoDataUrl = async () => {
    try {
      const response = await fetch("/logo.png");
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Logo not loaded:", err);
      return null;
    }
  };

  let logoDataUrl = await getLogoDataUrl();

  let yPosition = margin;

  const addLogo = () => {
    if (logoDataUrl) {
      const logoWidth = 50;
      const logoHeight = 20;
      pdf.addImage(
        logoDataUrl,
        "PNG",
        (pageWidth - logoWidth) / 2,
        5,
        logoWidth,
        logoHeight
      );
      yPosition = 5 + logoHeight + 5;
    }
  };

  addLogo();

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(108, 63, 197);
  pdf.setFont(undefined, "bold");

  pdf.text(
    `${itinerary?.destination || ""} Travel Itinerary`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );

  yPosition += 15;
  pdf.setFont(undefined, "normal");

  // Basic Info
  pdf.setFontSize(13);
  pdf.setTextColor(52, 73, 94);

  if (fromLocation) {
    pdf.text(`From: ${fromLocation}`, margin, yPosition);
    yPosition += 7;
  }

  pdf.text(`Duration: ${itinerary?.duration || ""}`, margin, yPosition);
  pdf.text(
    `Total Budget: ${itinerary?.totalBudget || ""}`,
    pageWidth - margin - 60,
    yPosition
  );

  yPosition += 10;

  const days = itinerary?.days || [];

  for (const day of days) {
    const activities = day?.activities || [];
    const flights = day?.flights || [];
    const transfers = day?.transfers || [];

    const estCardHeight =
      40 + activities.length * 15 + flights.length * 10 + transfers.length * 10;

    if (yPosition + estCardHeight > pageHeight - margin) {
      pdf.addPage();
      addLogo();
      yPosition = margin;
    }

    pdf.setFillColor(247, 245, 251);
    pdf.roundedRect(
      margin,
      yPosition,
      cardWidth,
      estCardHeight,
      6,
      6,
      "F"
    );

    let cardY = yPosition + cardPadding;

    // Day title
    pdf.setFontSize(16);
    pdf.setTextColor(108, 63, 197);
    pdf.setFont(undefined, "bold");

    const cleanTitle =
      (day?.title || "").replace(/^Day \d+ - /, "") || "";

    pdf.text(
      `Day ${day?.day || ""}: ${cleanTitle}`,
      margin + cardPadding,
      cardY
    );
    cardY += 8;

    // Date
    pdf.setFontSize(11);
    pdf.setTextColor(127, 140, 141);
    pdf.setFont(undefined, "normal");
    pdf.text(day?.date || "", margin + cardPadding, cardY);
    cardY += 8;

    // Activities section
    if (activities.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(41, 128, 185);
      pdf.setFont(undefined, "bold");
      pdf.text("Activities", margin + cardPadding, cardY);
      cardY += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.setTextColor(52, 73, 94);

      for (const a of activities) {
        pdf.text(
          `${a?.time || ""}  ${a?.activity || ""}`,
          margin + cardPadding + 2,
          cardY
        );
        cardY += 4.5;

        const desc = pdf.splitTextToSize(
          a?.description || "",
          cardWidth - 2 * cardPadding - 10
        );
        pdf.text(desc, margin + cardPadding + 6, cardY);
        cardY += desc.length * 4;

        pdf.setTextColor(39, 174, 96);
        pdf.text(
          `Cost: ${a?.cost || ""}`,
          margin + cardPadding + 6,
          cardY
        );
        cardY += 6;

        pdf.setTextColor(52, 73, 94);
      }
      cardY += sectionSpacing;
    }

    // Flights
    if (flights.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont(undefined, "bold");
      pdf.text("Flights", margin + cardPadding, cardY);
      cardY += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.setTextColor(52, 73, 94);

      for (const f of flights) {
        pdf.text(
          `Airline: ${f?.airline || ""}  No: ${f?.flightNumber || ""}`,
          margin + cardPadding + 2,
          cardY
        );
        cardY += 4.5;

        pdf.text(
          `Departure: ${f?.departure || ""}  Arrival: ${f?.arrival || ""}  Price: ${f?.price || ""}`,
          margin + cardPadding + 6,
          cardY
        );
        cardY += 6;
      }

      cardY += sectionSpacing;
    }

    // Transfers
    if (transfers.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont(undefined, "bold");
      pdf.text("Transfers", margin + cardPadding, cardY);
      cardY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(52, 73, 94);

      for (const t of transfers) {
        pdf.text(
          `Type: ${t?.type || ""} Time: ${t?.time || ""} Price: ${t?.price || ""} People: ${t?.peopleAllowed || ""}`,
          margin + cardPadding + 2,
          cardY
        );
        cardY += 6;
      }

      cardY += sectionSpacing;
    }

    // Day Total
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(108, 63, 197);

    pdf.text(
      `Day Total: ${day?.totalCost || ""}`,
      margin + cardWidth - cardPadding - 50,
      cardY
    );

    yPosition += estCardHeight + cardSpacing;
  }

  // Recommendations
  const recommendations = itinerary?.recommendations || [];

  if (recommendations.length > 0) {
    if (yPosition + 40 > pageHeight - margin) {
      pdf.addPage();
      addLogo();
      yPosition = margin;
    }

    const recHeight = 35 + recommendations.length * 7;

    pdf.setFillColor(233, 244, 255);
    pdf.roundedRect(margin, yPosition, cardWidth, recHeight, 6, 6, "F");

    let recY = yPosition + cardPadding + 2;

    pdf.setFontSize(14);
    pdf.setTextColor(41, 128, 185);
    pdf.setFont(undefined, "bold");

    pdf.text("Travel Recommendations", margin + cardPadding, recY);

    recY += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.setTextColor(52, 73, 94);

    for (const rec of recommendations) {
      const lines = pdf.splitTextToSize(
        rec || "",
        cardWidth - 2 * cardPadding - 10
      );

      pdf.text("•", margin + cardPadding + 2, recY);
      pdf.text(lines, margin + cardPadding + 7, recY);
      recY += lines.length * 4.5 + 2;
    }
  }

  pdf.save(`${itinerary?.destination || "travel"}-itinerary.pdf`);
}
