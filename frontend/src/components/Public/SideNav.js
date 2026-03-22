import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./side.css";

const menuItems = [
  { label: "Home", completed: true }, // ✅ First step always enabled
  { label: "Profile", completed: false },
  { label: "Education", completed: false },
  { label: "Career", completed: false },
  { label: "Social Media", completed: false },
];

const SideNav = () => {
  
  const [items, setItems] = useState(menuItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // ✅ Handle Next Step (Unlocks the next tab)
  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i <= activeIndex + 1 ? { ...item, completed: true } : item
        )
      );
      setActiveIndex(activeIndex + 1);
    }
  };

  // ✅ Handle Tab Click (Only allow completed tabs)
  const handleTabClick = (index) => {
    if (items[index].completed) {
      setActiveIndex(index);
    }
  };

  return (
    <div>
      {/* ✅ Open Sidebar Modal Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-md z-50 shadow-md hover:bg-gray-700 transition-all"
      >
        Open Menu
      </button>

      {/* ✅ Modal for SideNav */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* ✅ Dark Overlay (Click outside to close) */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            {/* ✅ SideNav inside Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl p-6 w-96 max-w-full z-50 rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* ✅ Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
                aria-label="Close Menu"
              >
                ✖
              </button>

              {/* ✅ Tab Menu */}
              <ul className="flex space-x-2 border-b pb-2">
                {items.map((item, index) => (
                  <li key={index} className="flex-1">
                    <button
                      onClick={() => handleTabClick(index)}
                      className={`w-full p-3 text-center rounded-t-md transition ${
                        index === activeIndex
                          ? "bg-red-500 text-white font-bold"
                          : "bg-gray-100 text-gray-600"
                      } ${!item.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!item.completed}
                    >
                      {item.label} {item.completed && <span>✅</span>}
                    </button>
                  </li>
                ))}
              </ul>

              {/* ✅ Tab Content */}
              <div className="p-4 text-gray-700">
                <h3 className="text-xl font-bold">{items[activeIndex].label}</h3>
                <p className="mt-2 text-gray-500">This is the {items[activeIndex].label} section.</p>

                {/* ✅ Show Next Button only if not on the last tab */}
                {activeIndex < items.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SideNav;
