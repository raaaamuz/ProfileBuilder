// src/components/education/EducationEdit.js
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Education1Edit from "./Education1Edit";
import Education2Edit from "./Education2Edit";
import Education3Edit from "./Education3Edit";

const EducationEdit = () => {
  const [searchParams] = useSearchParams();
  const design = searchParams.get("design") || "design1";

  // You could initialize this with the data fetched from your backend if needed.
  const [templateData, setTemplateData] = useState({
    title: "",
    description: "",
  });

  let EditComponent;

  switch (design) {
    case "design2":
      EditComponent = (
        <Education2Edit data={templateData} setData={setTemplateData} />
      );
      break;
    case "design3":
      EditComponent = (
        <Education3Edit data={templateData} setData={setTemplateData} />
      );
      break;
    default:
      EditComponent = (
        <Education1Edit data={templateData} setData={setTemplateData} />
      );
      break;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">
        Edit Education - {design}
      </h1>
      {EditComponent}
      {/* Optionally add a "Save" button that sends the updated templateData to your backend */}
    </div>
  );
};

export default EducationEdit;
