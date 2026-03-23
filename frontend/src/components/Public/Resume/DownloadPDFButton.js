import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, Loader2 } from "lucide-react";

// Import print styles
import "../../../styles/resumePrint.css";

export default function DownloadPDFButton({ contentRef, fileName = "Professional_Resume" }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) {
      console.error("Content ref is not defined");
      return;
    }

    setDownloading(true);

    try {
      // Use html2canvas with higher quality settings
      const canvas = await html2canvas(contentRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // Preserve colors
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body;
          clonedElement.style.webkitPrintColorAdjust = "exact";
          clonedElement.style.printColorAdjust = "exact";
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Create a new jsPDF instance with A4 page size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // A4 dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Calculate image dimensions to fit A4
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
        undefined,
        "FAST"
      );

      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("Error generating PDF: ", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
    >
      {downloading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download size={18} />
          Download PDF
        </>
      )}
    </button>
  );
}
