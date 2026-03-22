import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DownloadPDFButton({ contentRef }) {
  const handleDownload = async () => {
    if (contentRef.current) {
      try {
        // Use html2canvas to capture the content as a canvas
        const canvas = await html2canvas(contentRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        
        // Create a new jsPDF instance with A4 page size
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        
        // Calculate dimensions to fit the A4 page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Professional_Resume.pdf");
      } catch (err) {
        console.error("Error generating PDF: ", err);
      }
    } else {
      console.error("Content ref is not defined");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    >
      Download as PDF
    </button>
  );
}
