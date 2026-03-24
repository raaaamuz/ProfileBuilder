import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../services/api";
import { getSubdomainUsername } from "../../../utils/subdomain";

const Education = ({ liveDesignConfig, liveEducationData, globalFont, isAdminPreview: isAdminPreviewProp = false }) => {
  const [educationData, setEducationData] = useState([]);
  const [designConfig, setDesignConfig] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const token = localStorage.getItem("token");
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;

  // Check if we're in admin preview mode
  const isAdminPreview = isAdminPreviewProp || (!username && window.location.pathname.includes('/dashboard/'));

  // Default design if none selected
  const defaultDesign = {
    backgroundColor: "#1a1a2e",
    textColor: "#eaeaea",
    accentColor: "#7c3aed",
    buttonTextColor: "#ffffff", // Light text on dark accent
    secondaryTextColor: "#9ca3af",
    fontFamily: "Inter, sans-serif",
    layoutType: "cards",
    cardStyle: "elevated",
    borderRadius: 12,
    spacing: "normal"
  };

  // Helper to get contrast text color for accent backgrounds
  const getButtonTextColor = () => {
    return design.buttonTextColor || "#ffffff";
  };

  // Use live education data in admin preview mode
  useEffect(() => {
    if (isAdminPreview && liveEducationData && liveEducationData.length > 0) {
      setEducationData(liveEducationData);
    }
  }, [isAdminPreview, liveEducationData]);

  // Fetch Education Data (skip if in admin preview with live data)
  // If username is present, always fetch public data (even if user is logged in)
  useEffect(() => {
    // Skip fetching if we're in admin preview mode with live data
    if (isAdminPreview && liveEducationData && liveEducationData.length > 0) {
      return;
    }

    if (username) {
      // Public profile view - fetch public data
      api
        .get(`/public/profile/${username}/`)
        .then((res) => {
          const entries = res.data?.educationEntries || res.data?.education_entries || [];
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching public education data:", err);
          setEducationData([]);
        });
    } else if (token) {
      // Authenticated user viewing their own profile
      api
        .get("/education/entries/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          const entries = Array.isArray(res.data) ? res.data : (res.data?.education_entries || []);
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching education data:", err);
          setEducationData([]);
        });
    }
  }, [token, username, isAdminPreview, liveEducationData]);

  // Fetch Design Config
  // If username is present, always fetch public design (even if user is logged in)
  useEffect(() => {
    if (username) {
      // Public profile view - fetch public design
      api
        .get(`/public/profile/${username}/`)
        .then((res) => {
          if (res.data?.education_design_config) {
            setDesignConfig(res.data.education_design_config);
          } else {
            setDesignConfig(defaultDesign);
          }
        })
        .catch((err) => {
          console.error("Error fetching public design:", err);
          setDesignConfig(defaultDesign);
        });
    } else if (token) {
      api
        .get("/education/selected-design/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          if (res.data?.design_config) {
            setDesignConfig(res.data.design_config);
          } else {
            setDesignConfig(defaultDesign);
          }
        })
        .catch((err) => {
          console.error("Error fetching design:", err);
          setDesignConfig(defaultDesign);
        });
    } else {
      setDesignConfig(defaultDesign);
    }
  }, [token, username]);

  // Use liveDesignConfig if provided (for admin preview), otherwise use fetched config
  const design = { ...defaultDesign, ...(liveDesignConfig || designConfig) };

  // Get card style based on design
  const getCardStyle = (isHovered = false) => {
    const base = {
      borderRadius: `${design.borderRadius || 12}px`,
      transition: "all 0.3s ease",
    };

    switch (design.cardStyle) {
      case "glassmorphism":
        return {
          ...base,
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          border: `1px solid rgba(255,255,255,0.2)`,
          boxShadow: isHovered ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.1)",
        };
      case "bordered":
        return {
          ...base,
          backgroundColor: "transparent",
          border: `2px solid ${design.accentColor}`,
          boxShadow: isHovered ? `0 0 20px ${design.accentColor}40` : "none",
        };
      case "flat":
        return {
          ...base,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "none",
          boxShadow: "none",
        };
      case "elevated":
      default:
        return {
          ...base,
          backgroundColor: "rgba(255,255,255,0.08)",
          boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.15)",
        };
    }
  };

  // Get spacing value
  const getSpacing = () => {
    switch (design.spacing) {
      case "compact": return "1rem";
      case "relaxed": return "3rem";
      default: return "2rem";
    }
  };

  // CARDS LAYOUT
  const CardsLayout = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: getSpacing()
    }}>
      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
            ...getCardStyle(),
            padding: "1.5rem",
            cursor: "pointer",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: design.accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}>
              🎓
            </div>
            <span style={{
              backgroundColor: `${design.accentColor}30`,
              color: design.accentColor,
              padding: "0.3rem 0.8rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: "600",
            }}>
              {entry.year}
            </span>
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            {entry.degree}
          </h3>
          <p style={{ opacity: 0.8, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
            {entry.university}
          </p>
          {entry.description && (
            <p style={{ fontSize: "0.85rem", opacity: 0.7, lineHeight: "1.6" }}>
              {entry.description.length > 120 ? `${entry.description.substring(0, 120)}...` : entry.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );

  // TIMELINE LAYOUT - Basic timeline on left
  const TimelineLayout = () => (
    <div style={{ position: "relative", paddingLeft: "3rem" }}>
      {/* Timeline line */}
      <div style={{
        position: "absolute",
        left: "1rem",
        top: 0,
        bottom: 0,
        width: "3px",
        background: `linear-gradient(180deg, ${design.accentColor}, ${design.accentColor}40)`,
        borderRadius: "2px",
      }} />

      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          style={{ marginBottom: getSpacing(), position: "relative" }}
        >
          {/* Timeline dot */}
          <motion.div
            whileHover={{ scale: 1.3 }}
            style={{
              position: "absolute",
              left: "-2.5rem",
              top: "1.5rem",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: design.accentColor,
              border: `4px solid ${design.backgroundColor}`,
              boxShadow: `0 0 0 4px ${design.accentColor}40`,
              zIndex: 1,
            }}
          />

          <motion.div
            whileHover={{ x: 10 }}
            style={{
              ...getCardStyle(),
              padding: "1.5rem",
              borderLeft: `4px solid ${design.accentColor}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.4rem" }}>
                  {entry.degree}
                </h3>
                <p style={{ opacity: 0.85, fontSize: "1rem" }}>
                  {entry.university}
                </p>
              </div>
              <span style={{
                backgroundColor: design.accentColor,
                color: getButtonTextColor(),
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                fontWeight: "600",
              }}>
                {entry.year}
              </span>
            </div>
            {entry.description && (
              <p style={{ marginTop: "1rem", fontSize: "0.95rem", opacity: 0.85, lineHeight: "1.7" }}>
                {entry.description}
              </p>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );

  // ALTERNATING TIMELINE - Zigzag pattern with entries on alternate sides
  const AlternatingTimelineLayout = () => (
    <div style={{ position: "relative", maxWidth: isAdminPreview ? "none" : "900px", margin: isAdminPreview ? "0" : "0 auto", width: "100%" }}>
      {/* Center timeline line */}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 0,
        bottom: 0,
        width: "4px",
        background: `linear-gradient(180deg, ${design.accentColor}, ${design.accentColor}60, ${design.accentColor})`,
        borderRadius: "4px",
      }} />

      {educationData.map((entry, index) => {
        const isLeft = index % 2 === 0;
        return (
          <motion.div
            key={entry.id || index}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
            style={{
              display: "flex",
              justifyContent: isLeft ? "flex-start" : "flex-end",
              marginBottom: "3rem",
              position: "relative",
              paddingLeft: isLeft ? 0 : "52%",
              paddingRight: isLeft ? "52%" : 0,
            }}
          >
            {/* Timeline node */}
            <motion.div
              whileHover={{ scale: 1.4, rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: "2rem",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${design.accentColor}, ${design.accentColor}80)`,
                border: `4px solid ${design.backgroundColor}`,
                boxShadow: `0 0 20px ${design.accentColor}60`,
                zIndex: 2,
              }}
            />

            {/* Connector line */}
            <div style={{
              position: "absolute",
              top: "2.5rem",
              [isLeft ? "right" : "left"]: "50%",
              width: "calc(2% + 20px)",
              height: "3px",
              background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, ${design.accentColor}40, ${design.accentColor})`,
            }} />

            {/* Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                ...getCardStyle(),
                padding: "1.5rem",
                width: "100%",
                position: "relative",
                borderLeft: isLeft ? `4px solid ${design.accentColor}` : "none",
                borderRight: !isLeft ? `4px solid ${design.accentColor}` : "none",
              }}
            >
              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                [isLeft ? "right" : "left"]: 0,
                width: "100px",
                height: "100%",
                background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, transparent, ${design.accentColor}10)`,
                borderRadius: `${design.borderRadius}px`,
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}>
                  <span style={{
                    background: `linear-gradient(135deg, ${design.accentColor}, ${design.accentColor}80)`,
                    color: getButtonTextColor(),
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    boxShadow: `0 4px 15px ${design.accentColor}40`,
                  }}>
                    {entry.year}
                  </span>
                </div>
                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  marginBottom: "0.5rem",
                  background: `linear-gradient(135deg, ${design.textColor}, ${design.accentColor})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {entry.degree}
                </h3>
                <p style={{
                  opacity: 0.85,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <span style={{ color: design.accentColor }}>📍</span>
                  {entry.university}
                </p>
                {entry.description && (
                  <p style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    opacity: 0.75,
                    lineHeight: "1.7",
                    borderTop: `1px solid ${design.accentColor}30`,
                    paddingTop: "0.75rem",
                  }}>
                    {entry.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );

  // JOURNEY PATH - Winding path design with icons
  const JourneyPathLayout = () => (
    <div style={{ position: "relative", padding: "0 2rem" }}>
      {educationData.map((entry, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={entry.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            style={{
              display: "flex",
              flexDirection: isEven ? "row" : "row-reverse",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            {/* Large circular icon */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              style={{
                flexShrink: 0,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${design.accentColor}, ${design.accentColor}60)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                boxShadow: `0 10px 40px ${design.accentColor}40`,
                border: `4px solid ${design.backgroundColor}`,
              }}
            >
              🎓
            </motion.div>

            {/* Connecting line */}
            <div style={{
              flex: 1,
              height: "4px",
              background: `linear-gradient(${isEven ? "90deg" : "270deg"}, ${design.accentColor}, transparent)`,
              borderRadius: "4px",
            }} />

            {/* Content card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: `0 20px 60px ${design.accentColor}30` }}
              style={{
                ...getCardStyle(),
                padding: "2rem",
                flex: 2,
                background: `linear-gradient(135deg, ${design.cardStyle === 'glassmorphism' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}, transparent)`,
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}>
                <span style={{
                  background: design.accentColor,
                  color: getButtonTextColor(),
                  padding: "0.5rem 1.2rem",
                  borderRadius: "25px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                }}>
                  {entry.year}
                </span>
                <div style={{
                  width: "30px",
                  height: "2px",
                  background: design.accentColor,
                }} />
              </div>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
              }}>
                {entry.degree}
              </h3>
              <p style={{
                opacity: 0.8,
                fontSize: "1.05rem",
                marginBottom: entry.description ? "1rem" : 0,
              }}>
                {entry.university}
              </p>
              {entry.description && (
                <p style={{
                  fontSize: "0.95rem",
                  opacity: 0.7,
                  lineHeight: "1.7",
                  paddingTop: "0.75rem",
                  borderTop: `1px dashed ${design.accentColor}40`,
                }}>
                  {entry.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );

  // BOOK STACK - Stacked book design
  const BookStackLayout = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      maxWidth: isAdminPreview ? "none" : "700px",
      margin: isAdminPreview ? "0" : "0 auto",
      width: "100%",
      perspective: "1000px",
    }}>
      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, rotateX: -30 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ delay: index * 0.15 }}
          whileHover={{
            scale: 1.02,
            rotateY: 5,
            x: 10,
            boxShadow: `12px 12px 30px ${design.accentColor}30`,
          }}
          style={{
            ...getCardStyle(),
            padding: 0,
            overflow: "hidden",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Book spine effect */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "12px",
            background: `linear-gradient(90deg, ${design.accentColor}80, ${design.accentColor})`,
          }} />

          <div style={{ padding: "1.5rem", paddingLeft: "2rem" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}>
              <div>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "0.3rem",
                }}>
                  {entry.degree}
                </h3>
                <p style={{
                  opacity: 0.75,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <span>🏛️</span> {entry.university}
                </p>
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${design.accentColor}, ${design.accentColor}80)`,
                color: getButtonTextColor(),
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "700",
                boxShadow: `0 4px 15px ${design.accentColor}40`,
              }}>
                📅 {entry.year}
              </div>
            </div>
            {entry.description && (
              <p style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                opacity: 0.7,
                lineHeight: "1.6",
              }}>
                {entry.description}
              </p>
            )}
          </div>

          {/* Page edges effect */}
          <div style={{
            position: "absolute",
            right: "3px",
            top: "10%",
            bottom: "10%",
            width: "3px",
            background: `repeating-linear-gradient(180deg, ${design.textColor}10, ${design.textColor}10 2px, transparent 2px, transparent 4px)`,
          }} />
        </motion.div>
      ))}
    </div>
  );

  // FLOATING CARDS - 3D floating effect
  const FloatingCardsLayout = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "2rem",
      perspective: "1000px",
    }}>
      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: index * 0.15, type: "spring" }}
          whileHover={{
            y: -15,
            rotateY: 10,
            rotateX: -5,
            boxShadow: `0 30px 60px ${design.accentColor}30`,
          }}
          style={{
            ...getCardStyle(),
            padding: "2rem",
            transformStyle: "preserve-3d",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background gradient animation */}
          <motion.div
            animate={{
              background: [
                `linear-gradient(45deg, ${design.accentColor}20, transparent)`,
                `linear-gradient(225deg, ${design.accentColor}20, transparent)`,
                `linear-gradient(45deg, ${design.accentColor}20, transparent)`,
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: `${design.borderRadius}px`,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${design.accentColor}, ${design.accentColor}60)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                boxShadow: `0 8px 25px ${design.accentColor}40`,
              }}>
                🎓
              </div>
              <span style={{
                background: `rgba(255,255,255,0.1)`,
                backdropFilter: "blur(10px)",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                border: `1px solid ${design.accentColor}40`,
              }}>
                {entry.year}
              </span>
            </div>

            <h3 style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              marginBottom: "0.5rem",
              background: `linear-gradient(135deg, ${design.textColor}, ${design.accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {entry.degree}
            </h3>
            <p style={{ opacity: 0.8, fontSize: "1rem" }}>
              {entry.university}
            </p>
            {entry.description && (
              <p style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                opacity: 0.7,
                lineHeight: "1.6",
              }}>
                {entry.description.length > 100
                  ? `${entry.description.substring(0, 100)}...`
                  : entry.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // GRID LAYOUT
  const GridLayout = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: getSpacing(),
    }}>
      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          style={{
            ...getCardStyle(),
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* Colored header bar */}
          <div style={{
            height: "8px",
            background: `linear-gradient(90deg, ${design.accentColor}, ${design.accentColor}80)`,
          }} />
          <div style={{ padding: "1.25rem" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: `${design.accentColor}20`,
              color: design.accentColor,
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "600",
              marginBottom: "0.75rem",
            }}>
              {entry.year}
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.4rem" }}>
              {entry.degree}
            </h3>
            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
              {entry.university}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // MINIMAL LAYOUT
  const MinimalLayout = () => (
    <div style={{ maxWidth: isAdminPreview ? "none" : "600px", margin: isAdminPreview ? "0" : "0 auto", width: "100%" }}>
      {educationData.map((entry, index) => (
        <motion.div
          key={entry.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          style={{
            padding: "1.5rem 0",
            borderBottom: index < educationData.length - 1 ? `1px solid ${design.accentColor}30` : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              {entry.degree}
            </h3>
            <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>
              {entry.year}
            </span>
          </div>
          <p style={{ opacity: 0.7, fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {entry.university}
          </p>
        </motion.div>
      ))}
    </div>
  );

  // ACCORDION LAYOUT
  const AccordionLayout = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {educationData.map((entry, index) => {
        const isExpanded = expandedId === (entry.id || index);
        return (
          <motion.div
            key={entry.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              ...getCardStyle(),
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedId(isExpanded ? null : (entry.id || index))}
              style={{
                padding: "1.25rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{
                  backgroundColor: design.accentColor,
                  color: getButtonTextColor(),
                  padding: "0.3rem 0.7rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}>
                  {entry.year}
                </span>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.2rem" }}>
                    {entry.degree}
                  </h3>
                  <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                    {entry.university}
                  </p>
                </div>
              </div>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                style={{ fontSize: "1.2rem", opacity: 0.6 }}
              >
                ▼
              </motion.span>
            </div>
            <AnimatePresence>
              {isExpanded && entry.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    padding: "0 1.5rem 1.25rem",
                    borderTop: `1px solid ${design.accentColor}30`,
                  }}
                >
                  <p style={{ paddingTop: "1rem", fontSize: "0.95rem", opacity: 0.85, lineHeight: "1.7" }}>
                    {entry.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );

  // Render layout based on type
  const renderLayout = () => {
    if (educationData.length === 0) {
      return <p style={{ textAlign: "center", opacity: 0.7 }}>No education entries found.</p>;
    }

    switch (design.layoutType) {
      case "timeline":
        return <TimelineLayout />;
      case "alternating":
        return <AlternatingTimelineLayout />;
      case "journey":
        return <JourneyPathLayout />;
      case "bookstack":
        return <BookStackLayout />;
      case "floating":
        return <FloatingCardsLayout />;
      case "grid":
        return <GridLayout />;
      case "minimal":
        return <MinimalLayout />;
      case "accordion":
        return <AccordionLayout />;
      case "cards":
      default:
        return <CardsLayout />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: design.backgroundColor,
        color: design.textColor,
        fontFamily: globalFont || design.fontFamily,
        paddingTop: "4rem",
        paddingBottom: "4rem",
        width: "100%",
      }}
    >
      <div className="w-full px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "3rem",
            textAlign: "center",
            borderBottom: `3px solid ${design.accentColor}`,
            paddingBottom: "1rem",
          }}
        >
          Education
        </motion.h1>

        {renderLayout()}
      </div>
    </motion.div>
  );
};

export default Education;
