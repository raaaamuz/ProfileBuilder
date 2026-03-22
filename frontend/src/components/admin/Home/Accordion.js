import React, { useState, useRef, useEffect } from "react";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  const toggleAccordion = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // Set height for smooth open/close transition
    setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [open]);

  return (
    <div className="border rounded-xl hover:shadow-2xl">
      <div
        onClick={toggleAccordion}
        className="flex items-center text-gray-600 w-full border-b overflow-hidden mb-5 mx-auto cursor-pointer"
      >
        <div
          className={`w-10 border-r px-2 transform transition duration-300 ease-in-out ${
            open ? "rotate-90" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
        <div className="flex items-center px-2 py-3">
          <div className="mx-3">
            <button className="hover:underline">{title}</button>
          </div>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-max-height duration-500 ease-in-out border-b pb-10"
      >
        <div className="p-5 text-gray-600">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
