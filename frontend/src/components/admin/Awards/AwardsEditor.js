import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trophy, Star, ChevronDown, ChevronUp, Trash2, GripVertical, Plus, Check, Upload, Loader2 } from "lucide-react";
import api from "../../../services/api";
import { PreviewContext } from "../PreviewContext";

// Design presets for awards section - Each is a distinct visual concept
const AWARDS_DESIGNS = [
  {
    id: 'glassmorphism-gold',
    name: 'Glass Trophy',
    description: 'Frosted glass with golden accents',
    layoutType: 'cards',
    backgroundColor: '#0c0a1d',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    cardBg: 'rgba(251, 191, 36, 0.08)',
    cardBorder: '1px solid rgba(251, 191, 36, 0.2)',
    cardShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    fontFamily: 'Inter',
    cardStyle: 'glassmorphism',
    glowEffect: true,
  },
  {
    id: 'neumorphism-purple',
    name: 'Soft Royal',
    description: 'Soft 3D purple design',
    layoutType: 'grid',
    backgroundColor: '#e0e5ec',
    textColor: '#2d3436',
    accentColor: '#7c3aed',
    cardBg: '#e0e5ec',
    cardBorder: 'none',
    cardShadow: '6px 6px 12px #c8ccd4, -6px -6px 12px #ffffff',
    borderRadius: 24,
    fontFamily: 'Poppins',
    cardStyle: 'neumorphism',
  },
  {
    id: 'minimal-lines',
    name: 'Line Minimal',
    description: 'Clean lines, elegant simplicity',
    layoutType: 'list',
    backgroundColor: '#ffffff',
    textColor: '#18181b',
    accentColor: '#6366f1',
    cardBg: 'transparent',
    cardBorder: '1px solid #e5e5e5',
    cardShadow: 'none',
    borderRadius: 8,
    fontFamily: 'Inter',
    cardStyle: 'bordered',
  },
  {
    id: 'neon-cyber',
    name: 'Cyber Neon',
    description: 'Glowing neon cyberpunk',
    layoutType: 'cards',
    backgroundColor: '#0a0a0f',
    textColor: '#e0e0e0',
    accentColor: '#00ff88',
    cardBg: 'rgba(0, 255, 136, 0.05)',
    cardBorder: '1px solid #00ff88',
    cardShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
    borderRadius: 12,
    fontFamily: 'JetBrains Mono',
    cardStyle: 'neon',
    glowEffect: true,
  },
  {
    id: 'brutalist-bold',
    name: 'Bold Impact',
    description: 'Raw, bold brutalist design',
    layoutType: 'stacked',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#ef4444',
    cardBg: '#ffffff',
    cardBorder: '3px solid #000000',
    cardShadow: '6px 6px 0px #000000',
    borderRadius: 0,
    fontFamily: 'Space Grotesk',
    cardStyle: 'brutalist',
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora Glow',
    description: 'Flowing gradient backgrounds',
    layoutType: 'timeline',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    accentColor: '#f472b6',
    cardBg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    cardBorder: '1px solid rgba(244, 114, 182, 0.2)',
    cardShadow: '0 4px 24px rgba(244, 114, 182, 0.2)',
    borderRadius: 16,
    fontFamily: 'DM Sans',
    cardStyle: 'gradient',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%)',
    glowEffect: true,
  },
];

// Layout preview for design picker
const LayoutPreview = ({ design }) => {
  const { layoutType, accentColor } = design;

  switch (layoutType) {
    case 'grid':
      return (
        <div className="grid grid-cols-2 gap-1 w-full px-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 rounded" style={{ backgroundColor: `${accentColor}30` }}>
              <div className="w-2 h-2 rounded-full m-1" style={{ backgroundColor: accentColor }} />
            </div>
          ))}
        </div>
      );
    case 'list':
      return (
        <div className="space-y-1.5 w-full px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: accentColor }} />
              <div className="flex-1 h-1.5 rounded" style={{ backgroundColor: `${accentColor}40` }} />
            </div>
          ))}
        </div>
      );
    case 'timeline':
      return (
        <div className="flex items-center justify-center w-full px-2">
          <div className="w-0.5 h-12 rounded" style={{ backgroundColor: `${accentColor}40` }} />
          <div className="space-y-2 ml-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="w-8 h-1.5 rounded" style={{ backgroundColor: `${accentColor}30` }} />
              </div>
            ))}
          </div>
        </div>
      );
    case 'cards':
    default:
      return (
        <div className="flex gap-1.5 w-full px-2 justify-center">
          {[1, 2].map((i) => (
            <div key={i} className="w-8 h-10 rounded-lg p-1" style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
              <div className="w-3 h-3 rounded mx-auto" style={{ backgroundColor: accentColor }} />
            </div>
          ))}
        </div>
      );
  }
};

// Design Picker Component - Professional dark theme
const AwardsDesignPicker = ({ selectedDesign, onSelectDesign }) => {
  return (
    <div className="mb-5">
      <h3 style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>
        Design Style
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {AWARDS_DESIGNS.map((design) => (
          <button
            key={design.id}
            onClick={() => onSelectDesign(design)}
            className="relative p-3 rounded-md transition-all duration-150"
            style={{
              backgroundColor: design.backgroundColor,
              border: selectedDesign?.id === design.id
                ? '2px solid #6366f1'
                : '1px solid #334155',
              boxShadow: selectedDesign?.id === design.id
                ? '0 0 0 3px rgba(99, 102, 241, 0.2)'
                : 'none',
            }}
          >
            {selectedDesign?.id === design.id && (
              <div
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#6366f1' }}
              >
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="h-10 flex items-center justify-center">
              <LayoutPreview design={design} />
            </div>
            <p style={{ color: design.textColor, fontSize: '11px', fontWeight: 500, marginTop: '6px', textAlign: 'center' }}>
              {design.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sortable Row Component for Awards
const AwardRow = ({ entry, isExpanded, onToggleExpand, onUpdateEntry, onDelete, onCreateEntry }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entry.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [localEntry, setLocalEntry] = useState(entry);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalEntry(entry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    const updatedEntry = { ...localEntry, [field]: value };
    setLocalEntry(updatedEntry);

    // Debounce API call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (entry.isNew) {
        onCreateEntry(updatedEntry);
      } else {
        onUpdateEntry(updatedEntry);
      }
    }, 500);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: '#0f172a', border: '1px solid #334155' }}
      className="rounded-md mb-2 overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center px-3 py-2.5" style={{ borderBottom: isExpanded ? '1px solid #334155' : 'none' }}>
        <div {...attributes} {...listeners} className="cursor-grab mr-2" style={{ color: '#475569' }}>
          <GripVertical size={16} />
        </div>
        <Trophy size={16} style={{ color: '#6366f1', marginRight: '8px' }} />
        <div className="flex-1 min-w-0">
          <p style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{localEntry.title || "New Award"}</p>
          <p style={{ color: '#64748b', fontSize: '11px' }}>{localEntry.organization} {localEntry.year && `(${localEntry.year})`}</p>
        </div>
        <button onClick={onToggleExpand} className="p-1.5 rounded transition-colors hover:bg-white/5" style={{ color: '#64748b' }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded transition-colors hover:bg-red-500/10 ml-1" style={{ color: '#ef4444' }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Award Title</label>
              <input
                type="text"
                value={localEntry.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Best Employee Award"
              />
            </div>
            <div>
              <label>Organization</label>
              <input
                type="text"
                value={localEntry.organization || ""}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                placeholder="Company Name"
              />
            </div>
          </div>
          <div>
            <label>Year</label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={localEntry.year || ""}
              onChange={(e) => handleInputChange("year", e.target.value)}
              placeholder="2024"
            />
          </div>
          <div>
            <label>Description (Optional)</label>
            <textarea
              value={localEntry.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the award..."
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Sortable Row Component for Achievements
const AchievementRow = ({ entry, isExpanded, onToggleExpand, onUpdateEntry, onDelete, onCreateEntry }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entry.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [localEntry, setLocalEntry] = useState(entry);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalEntry(entry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    const updatedEntry = { ...localEntry, [field]: value };
    setLocalEntry(updatedEntry);

    // Debounce API call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (entry.isNew) {
        onCreateEntry(updatedEntry);
      } else {
        onUpdateEntry(updatedEntry);
      }
    }, 500);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: '#0f172a', border: '1px solid #334155' }}
      className="rounded-md mb-2 overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center px-3 py-2.5" style={{ borderBottom: isExpanded ? '1px solid #334155' : 'none' }}>
        <div {...attributes} {...listeners} className="cursor-grab mr-2" style={{ color: '#475569' }}>
          <GripVertical size={16} />
        </div>
        <Star size={16} style={{ color: '#6366f1', marginRight: '8px' }} />
        <div className="flex-1 min-w-0">
          <p style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>{localEntry.title || "New Achievement"}</p>
          <p style={{ color: '#64748b', fontSize: '11px' }}>{localEntry.year && `(${localEntry.year})`}</p>
        </div>
        <button onClick={onToggleExpand} className="p-1.5 rounded transition-colors hover:bg-white/5" style={{ color: '#64748b' }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded transition-colors hover:bg-red-500/10 ml-1" style={{ color: '#ef4444' }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Achievement Title</label>
              <input
                type="text"
                value={localEntry.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Completed Marathon"
              />
            </div>
            <div>
              <label>Year</label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={localEntry.year || ""}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={localEntry.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your achievement..."
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AwardsEditor = () => {
  const navigate = useNavigate();
  const { updateAwardsDesign, updateLiveAwards } = useContext(PreviewContext);
  const [activeTab, setActiveTab] = useState("awards");

  // Design state
  const [selectedDesign, setSelectedDesign] = useState(AWARDS_DESIGNS[0]);

  // Awards state
  const [awards, setAwards] = useState([]);
  const [expandedAwardIds, setExpandedAwardIds] = useState([]);

  // Achievements state
  const [achievements, setAchievements] = useState([]);
  const [expandedAchievementIds, setExpandedAchievementIds] = useState([]);

  // Import from CV state
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  useEffect(() => {
    fetchAwards();
    fetchAchievements();
    fetchDesign();
  }, []);

  // Sync awards data to live preview
  useEffect(() => {
    if (updateLiveAwards && awards.length > 0) {
      // Filter out unsaved entries for preview
      const savedAwards = awards.filter(a => !a.isNew);
      updateLiveAwards(savedAwards);
    }
  }, [awards, updateLiveAwards]);

  const fetchDesign = async () => {
    try {
      const response = await api.get('/achievements/design/');
      if (response.data?.design_config) {
        const savedDesign = AWARDS_DESIGNS.find(d => d.id === response.data.design_config.id);
        if (savedDesign) {
          setSelectedDesign(savedDesign);
          updateAwardsDesign(savedDesign);
        } else {
          setSelectedDesign(response.data.design_config);
          updateAwardsDesign(response.data.design_config);
        }
      }
    } catch (error) {
      console.log('No saved awards design');
    }
  };

  const handleSelectDesign = async (design) => {
    setSelectedDesign(design);

    // Update live preview
    if (updateAwardsDesign) {
      updateAwardsDesign(design);
    }

    try {
      await api.put('/achievements/design/', { design_config: design });
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  const handleImportFromCV = async () => {
    setIsImporting(true);
    setImportMessage("");
    try {
      // Import both awards and achievements
      const response = await api.post("/ai/import-from-cv/", { section: activeTab });
      if (response.data.success) {
        const imported = response.data.imported;
        const count = imported.awards || imported.achievements || 0;
        setImportMessage(`Imported ${count} ${activeTab} from your CV!`);
        // Refresh data
        if (activeTab === "awards") {
          fetchAwards();
        } else {
          fetchAchievements();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to import from CV";
      setImportMessage(errorMsg);
    } finally {
      setIsImporting(false);
    }
  };

  const fetchAwards = async () => {
    try {
      const response = await api.get("/achievements/awards/");
      setAwards(response.data);
    } catch (error) {
      console.error("Error fetching awards:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await api.get("/achievements/achievements/");
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // Awards handlers
  const toggleAwardExpand = (id) => {
    setExpandedAwardIds((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const handleAddAward = () => {
    const tempId = Date.now();
    const newEntry = { id: tempId, title: "", organization: "", year: "", description: "", isNew: true };
    setAwards((prev) => [...prev, newEntry]);
    setExpandedAwardIds((prev) => [...prev, tempId]);
  };

  const handleCreateAward = async (entry) => {
    try {
      const response = await api.post("/achievements/awards/", {
        title: entry.title,
        organization: entry.organization,
        year: entry.year,
        description: entry.description,
      });
      const oldId = entry.id;
      const newId = response.data.id;
      setAwards((prev) => prev.map((e) => (e.id === oldId ? { ...response.data, isNew: false } : e)));
      // Update expanded IDs to use new server ID
      setExpandedAwardIds((prev) => prev.map((id) => (id === oldId ? newId : id)));
    } catch (error) {
      console.error("Error creating award:", error);
    }
  };

  const handleUpdateAward = useCallback(async (updatedEntry) => {
    setAwards((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    try {
      await api.put(`/achievements/awards/${updatedEntry.id}/`, updatedEntry);
    } catch (error) {
      console.error("Error updating award:", error);
    }
  }, []);

  const handleDeleteAward = async (id) => {
    const entry = awards.find(a => a.id === id);
    if (entry?.isNew) {
      setAwards((prev) => prev.filter((e) => e.id !== id));
      return;
    }
    try {
      await api.delete(`/achievements/awards/${id}/`);
      setAwards((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting award:", error);
    }
  };

  const handleAwardDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = awards.findIndex((item) => item.id === active.id);
    const newIndex = awards.findIndex((item) => item.id === over.id);
    const updatedData = arrayMove(awards, oldIndex, newIndex);
    setAwards(updatedData);
    try {
      await api.put("/achievements/awards/reorder/", { reorderedData: updatedData });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Achievements handlers
  const toggleAchievementExpand = (id) => {
    setExpandedAchievementIds((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const handleAddAchievement = () => {
    const tempId = Date.now();
    const newEntry = { id: tempId, title: "", description: "", year: "", isNew: true };
    setAchievements((prev) => [...prev, newEntry]);
    setExpandedAchievementIds((prev) => [...prev, tempId]);
  };

  const handleCreateAchievement = async (entry) => {
    try {
      const response = await api.post("/achievements/achievements/", {
        title: entry.title,
        description: entry.description,
        year: entry.year,
      });
      const oldId = entry.id;
      const newId = response.data.id;
      setAchievements((prev) => prev.map((e) => (e.id === oldId ? { ...response.data, isNew: false } : e)));
      // Update expanded IDs to use new server ID
      setExpandedAchievementIds((prev) => prev.map((id) => (id === oldId ? newId : id)));
    } catch (error) {
      console.error("Error creating achievement:", error);
    }
  };

  const handleUpdateAchievement = useCallback(async (updatedEntry) => {
    setAchievements((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    try {
      await api.put(`/achievements/achievements/${updatedEntry.id}/`, updatedEntry);
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  }, []);

  const handleDeleteAchievement = async (id) => {
    const entry = achievements.find(a => a.id === id);
    if (entry?.isNew) {
      setAchievements((prev) => prev.filter((e) => e.id !== id));
      return;
    }
    try {
      await api.delete(`/achievements/achievements/${id}/`);
      setAchievements((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const handleAchievementDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = achievements.findIndex((item) => item.id === active.id);
    const newIndex = achievements.findIndex((item) => item.id === over.id);
    const updatedData = arrayMove(achievements, oldIndex, newIndex);
    setAchievements(updatedData);
    try {
      await api.put("/achievements/achievements/reorder/", { reorderedData: updatedData });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return (
    <div className="p-5">
      {/* Design Picker */}
      <AwardsDesignPicker
        selectedDesign={selectedDesign}
        onSelectDesign={handleSelectDesign}
      />

      {/* Import from CV Button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleImportFromCV}
          disabled={isImporting}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700 text-white font-medium rounded hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Importing...
            </>
          ) : (
            <>
              <Upload size={14} />
              Import from CV
            </>
          )}
        </button>
        {importMessage && (
          <span className={`text-sm ${importMessage.includes("Failed") || importMessage.includes("error") ? "text-red-400" : "text-green-400"}`}>
            {importMessage}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-md" style={{ backgroundColor: '#0f172a' }}>
        <button
          onClick={() => setActiveTab("awards")}
          className="flex-1 py-2 px-3 rounded text-sm font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: activeTab === "awards" ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === "awards" ? '#6366f1' : '#64748b',
          }}
        >
          <Trophy size={16} />
          Awards ({awards.length})
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className="flex-1 py-2 px-3 rounded text-sm font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: activeTab === "achievements" ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === "achievements" ? '#6366f1' : '#64748b',
          }}
        >
          <Star size={16} />
          Achievements ({achievements.length})
        </button>
      </div>

      {/* Awards Tab */}
      {activeTab === "awards" && (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleAwardDragEnd}>
            <SortableContext items={awards.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              {awards.map((entry) => (
                <AwardRow
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedAwardIds.includes(entry.id)}
                  onToggleExpand={() => toggleAwardExpand(entry.id)}
                  onUpdateEntry={handleUpdateAward}
                  onDelete={handleDeleteAward}
                  onCreateEntry={handleCreateAward}
                />
              ))}
            </SortableContext>
          </DndContext>

          {awards.length === 0 && (
            <div
              className="text-center py-8 rounded-md"
              style={{ backgroundColor: '#0f172a', border: '1px dashed #334155' }}
            >
              <Trophy size={32} style={{ color: '#475569', margin: '0 auto 8px' }} />
              <p style={{ color: '#64748b', fontSize: '13px' }}>No awards yet. Add your first award!</p>
            </div>
          )}

          <button
            onClick={handleAddAward}
            className="w-full mt-3 px-4 py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#6366f1', color: '#ffffff' }}
          >
            <Plus size={16} />
            Add Award
          </button>
        </>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleAchievementDragEnd}>
            <SortableContext items={achievements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              {achievements.map((entry) => (
                <AchievementRow
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedAchievementIds.includes(entry.id)}
                  onToggleExpand={() => toggleAchievementExpand(entry.id)}
                  onUpdateEntry={handleUpdateAchievement}
                  onDelete={handleDeleteAchievement}
                  onCreateEntry={handleCreateAchievement}
                />
              ))}
            </SortableContext>
          </DndContext>

          {achievements.length === 0 && (
            <div
              className="text-center py-8 rounded-md"
              style={{ backgroundColor: '#0f172a', border: '1px dashed #334155' }}
            >
              <Star size={32} style={{ color: '#475569', margin: '0 auto 8px' }} />
              <p style={{ color: '#64748b', fontSize: '13px' }}>No achievements yet. Add your first achievement!</p>
            </div>
          )}

          <button
            onClick={handleAddAchievement}
            className="w-full mt-3 px-4 py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#6366f1', color: '#ffffff' }}
          >
            <Plus size={16} />
            Add Achievement
          </button>
        </>
      )}

    </div>
  );
};

export default AwardsEditor;
