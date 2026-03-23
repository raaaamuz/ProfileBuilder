import React, { useRef } from "react";
import { X, Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Full-page preview modal for resume
 * Shows A4-sized preview with download options
 */
const FullPagePreviewModal = ({ isOpen, onClose, resumeHtml, title = "Resume Preview" }) => {
  const previewRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current.querySelector("iframe")?.contentDocument?.body || previewRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    const iframe = previewRef.current?.querySelector("iframe");
    if (iframe?.contentWindow) {
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[95vh] bg-gray-100 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div
          ref={previewRef}
          className="flex-1 overflow-auto p-6 flex justify-center"
          style={{ backgroundColor: "#525659" }}
        >
          {resumeHtml ? (
            <div
              className="bg-white shadow-xl"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: 0,
              }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                          -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important;
                        }
                        @media print {
                          body { -webkit-print-color-adjust: exact !important; }
                        }
                      </style>
                    </head>
                    <body>${resumeHtml}</body>
                  </html>
                `}
                style={{
                  width: "100%",
                  height: "297mm",
                  border: "none",
                }}
                title="Resume Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No resume content to preview</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 bg-white border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Preview is shown at A4 size (210mm × 297mm). Download PDF for best quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullPagePreviewModal;
