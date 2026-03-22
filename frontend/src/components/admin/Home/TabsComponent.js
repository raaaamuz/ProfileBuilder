import React, { useState, useEffect, useRef } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

const TabsComponent = ({ tabs, links }) => {
  const [isTabsActive, setIsTabsActive] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const indicatorRef = useRef(null);
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    if (tabsContainerRef.current) {
      new PerfectScrollbar(tabsContainerRef.current);
    }
  }, []);

  const handleSetActiveTab = (e, title, index) => {
    e.preventDefault();
    setActiveTab(title);
    // Adjust indicator position (assuming 96px width per tab)
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(${96 * index}px)`;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Tabs Content Area */}
      <div
        className={`${
          isTabsActive ? "block" : "hidden"
        } bg-white border-t-4 border-purple-500 border-x-4 rounded-t-2xl transition-all`}
      >
        <div
          id="tabs-container"
          ref={tabsContainerRef}
          className="relative h-64 overflow-hidden"
        >
          <ul className="p-6">
            {tabs.map((tab, index) => (
              tab.title === activeTab && (
                <li key={index} className="space-y-4">
                  <h2 className="text-3xl text-gray-700">
                    {tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}
                  </h2>
                  <div className="max-w-md text-base text-gray-500">
                    {tab.content}
                  </div>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative flex items-center overflow-hidden bg-white border-4 border-purple-500 rounded-b-2xl">
        <nav className="flex items-center justify-center h-20 gap-8 px-6">
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => handleSetActiveTab(e, link.title, index)}
              className="grid w-16 h-16 grid-cols-1 grid-rows-1"
            >
              <span className="sr-only">{link.title}</span>
              <div
                className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300 ${
                  activeTab !== link.title
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                dangerouslySetInnerHTML={{ __html: link.inActiveIcon }}
              />
              <div
                className={`col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300 ${
                  activeTab === link.title
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                dangerouslySetInnerHTML={{ __html: link.activeIcon }}
              />
            </a>
          ))}
        </nav>

        {/* Show/Hide Button */}
        <button
          onClick={() => setIsTabsActive(!isTabsActive)}
          className={`absolute z-10 flex items-center justify-center gap-2 transition-all bg-purple-500 ${
            isTabsActive
              ? "left-0 top-0 w-8 h-8 rounded-br-lg"
              : "w-full h-full inset-0"
          }`}
        >
          {!isTabsActive ? (
            <>
              <svg
                className="w-6 h-6 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <span className="text-white">Click to Open</span>
            </>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          )}
        </button>

        {/* Animated Indicator */}
        <div
          id="indicator"
          ref={indicatorRef}
          className="absolute w-6 h-8 transition-all duration-300 bg-purple-500 rounded-full -bottom-4 left-11"
        >
          <div
            style={{ boxShadow: "0 10px 0 rgb(168 85 247)" }}
            className="absolute w-5 h-5 bg-white -left-4 bottom-1/2 rounded-br-3xl"
          ></div>
          <div
            style={{ boxShadow: "0 10px 0 rgb(168 85 247)" }}
            className="absolute w-5 h-5 bg-white -right-4 bottom-1/2 rounded-bl-3xl"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TabsComponent;
