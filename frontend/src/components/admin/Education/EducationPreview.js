// src/pages/EducationPreview.js
import React, { useState } from "react";

const EducationPreview = ({ educationData, selectedDesign, designConfig }) => {
  const [expandedId, setExpandedId] = useState(null);

  const defaultDesign = {
    backgroundColor: "#1a1a2e",
    textColor: "#eaeaea",
    accentColor: "#7c3aed",
    buttonTextColor: "#ffffff", // Light text on dark accent
    fontFamily: "Inter, sans-serif",
    layoutType: "cards",
    cardStyle: "elevated",
    borderRadius: 12,
    spacing: "normal"
  };

  const design = { ...defaultDesign, ...designConfig };

  // Helper to get contrast text color for accent backgrounds
  const getButtonTextColor = () => {
    return design.buttonTextColor || "#ffffff";
  };

  // Get card style
  const getCardStyle = () => {
    const base = { borderRadius: `${design.borderRadius}px`, transition: "all 0.3s ease" };
    switch (design.cardStyle) {
      case "glassmorphism":
        return { ...base, backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)" };
      case "bordered":
        return { ...base, backgroundColor: "transparent", border: `2px solid ${design.accentColor}` };
      case "flat":
        return { ...base, backgroundColor: "rgba(255,255,255,0.05)" };
      default:
        return { ...base, backgroundColor: "rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" };
    }
  };

  const getSpacing = () => design.spacing === "compact" ? "1rem" : design.spacing === "relaxed" ? "2rem" : "1.5rem";

  // Cards Layout
  const CardsLayout = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: getSpacing() }}>
      {educationData.map((entry, index) => (
        <div key={entry.id || index} style={{ ...getCardStyle(), padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: design.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🎓</div>
            <span style={{ backgroundColor: `${design.accentColor}30`, color: design.accentColor, padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600' }}>{entry.year}</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.3rem' }}>{entry.degree}</h3>
          <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>{entry.university}</p>
        </div>
      ))}
    </div>
  );

  // Timeline Layout
  const TimelineLayout = () => (
    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
      <div style={{ position: 'absolute', left: '0.5rem', top: 0, bottom: 0, width: '2px', background: `linear-gradient(180deg, ${design.accentColor}, ${design.accentColor}40)` }} />
      {educationData.map((entry, index) => (
        <div key={entry.id || index} style={{ marginBottom: getSpacing(), position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-1.75rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: design.accentColor, boxShadow: `0 0 0 3px ${design.accentColor}40` }} />
          <div style={{ ...getCardStyle(), padding: '1rem', borderLeft: `3px solid ${design.accentColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{entry.degree}</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{entry.university}</p>
              </div>
              <span style={{ backgroundColor: design.accentColor, color: getButtonTextColor(), padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>{entry.year}</span>
            </div>
            {entry.description && <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>{entry.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );

  // Grid Layout
  const GridLayout = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: getSpacing() }}>
      {educationData.map((entry, index) => (
        <div key={entry.id || index} style={{ ...getCardStyle(), padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '6px', background: `linear-gradient(90deg, ${design.accentColor}, ${design.accentColor}80)` }} />
          <div style={{ padding: '1rem' }}>
            <div style={{ backgroundColor: `${design.accentColor}20`, color: design.accentColor, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', display: 'inline-block', marginBottom: '0.5rem' }}>{entry.year}</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.25rem' }}>{entry.degree}</h3>
            <p style={{ opacity: 0.8, fontSize: '0.8rem' }}>{entry.university}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Minimal Layout
  const MinimalLayout = () => (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      {educationData.map((entry, index) => (
        <div key={entry.id || index} style={{ padding: '1rem 0', borderBottom: index < educationData.length - 1 ? `1px solid ${design.accentColor}30` : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{entry.degree}</h3>
            <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>{entry.year}</span>
          </div>
          <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0.2rem' }}>{entry.university}</p>
        </div>
      ))}
    </div>
  );

  // Accordion Layout
  const AccordionLayout = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {educationData.map((entry, index) => {
        const isExpanded = expandedId === (entry.id || index);
        return (
          <div key={entry.id || index} style={{ ...getCardStyle(), overflow: 'hidden' }}>
            <div onClick={() => setExpandedId(isExpanded ? null : (entry.id || index))} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ backgroundColor: design.accentColor, color: getButtonTextColor(), padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>{entry.year}</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{entry.degree}</h3>
                  <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>{entry.university}</p>
                </div>
              </div>
              <span style={{ fontSize: '1rem', opacity: 0.6, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </div>
            {isExpanded && entry.description && (
              <div style={{ padding: '0 1rem 1rem', borderTop: `1px solid ${design.accentColor}30` }}>
                <p style={{ paddingTop: '0.75rem', fontSize: '0.9rem', opacity: 0.85, lineHeight: '1.5' }}>{entry.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderLayout = () => {
    if (!educationData || educationData.length === 0) {
      return <p style={{ opacity: 0.6 }}>No education entries yet. Add your first entry to see the preview.</p>;
    }
    switch (design.layoutType) {
      case "timeline": return <TimelineLayout />;
      case "grid": return <GridLayout />;
      case "minimal": return <MinimalLayout />;
      case "accordion": return <AccordionLayout />;
      default: return <CardsLayout />;
    }
  };

  return (
    <div style={{ width: '100%', minHeight: 400, backgroundColor: design.backgroundColor, color: design.textColor, fontFamily: design.fontFamily, padding: '2rem', borderRadius: '12px' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: `2px solid ${design.accentColor}`, paddingBottom: '0.5rem' }}>
        Education
      </h2>
      {renderLayout()}
    </div>
  );
};

export default EducationPreview;
