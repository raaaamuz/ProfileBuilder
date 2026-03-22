import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaStar, FaRegStar } from 'react-icons/fa';
import { FileText, Loader2, ArrowRight, Palette, Check } from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../PreviewContext';

// Design presets for skills section
const SKILLS_DESIGNS = [
  {
    id: 'cards-elevated',
    name: 'Elevated Cards',
    description: 'Modern cards with shadows',
    layoutType: 'cards',
    cardStyle: 'elevated',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#6366f1',
    preview: 'bg-white border-2 border-indigo-500',
  },
  {
    id: 'badges-compact',
    name: 'Compact Badges',
    description: 'Compact skill badges with circles',
    layoutType: 'badges',
    cardStyle: 'compact',
    backgroundColor: '#f8fafc',
    textColor: '#334155',
    accentColor: '#8b5cf6',
    preview: 'bg-slate-50 border-2 border-purple-500',
  },
  {
    id: 'list-minimal',
    name: 'Minimal List',
    description: 'Clean list with thin progress bars',
    layoutType: 'list',
    cardStyle: 'minimal',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    accentColor: '#10b981',
    preview: 'bg-white border-2 border-emerald-500',
  },
  {
    id: 'dark-neon',
    name: 'Dark Neon',
    description: 'Dark theme with glowing accents',
    layoutType: 'cards',
    cardStyle: 'glass',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    accentColor: '#22d3ee',
    preview: 'bg-slate-900 border-2 border-cyan-400',
  },
  {
    id: 'categories-grouped',
    name: 'Grouped by Category',
    description: 'Skills organized by category',
    layoutType: 'grouped',
    cardStyle: 'bordered',
    backgroundColor: '#fafafa',
    textColor: '#18181b',
    accentColor: '#f97316',
    preview: 'bg-zinc-50 border-2 border-orange-500',
  },
  {
    id: 'circular-meters',
    name: 'Circular Meters',
    description: 'Skills with circular progress',
    layoutType: 'circular',
    cardStyle: 'clean',
    backgroundColor: '#f0fdf4',
    textColor: '#166534',
    accentColor: '#22c55e',
    preview: 'bg-green-50 border-2 border-green-500',
  },
];

// Layout preview renderers for each design type
const LayoutPreview = ({ design }) => {
  const { layoutType, accentColor } = design;

  switch (layoutType) {
    case 'badges':
      // Circular badges preview
      return (
        <div className="flex gap-2 items-center justify-center">
          {[70, 85, 60].map((size, i) => (
            <div key={i} className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle cx="16" cy="16" r="12" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                <circle
                  cx="16" cy="16" r="12"
                  stroke={accentColor}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${size * 0.75} 100`}
                />
              </svg>
            </div>
          ))}
        </div>
      );

    case 'list':
      // Horizontal bars preview
      return (
        <div className="space-y-2 w-full px-2">
          {[85, 70, 55].map((width, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: accentColor }} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'grouped':
      // Grouped cards preview
      return (
        <div className="space-y-2 w-full px-2">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="h-1 flex-1 bg-gray-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[1, 2].map(i => (
              <div key={i} className="h-4 rounded" style={{ backgroundColor: `${accentColor}30` }} />
            ))}
          </div>
        </div>
      );

    case 'circular':
      // Large circular meters preview
      return (
        <div className="flex gap-3 items-center justify-center">
          {[80, 65].map((size, i) => (
            <div key={i} className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                <circle
                  cx="20" cy="20" r="16"
                  stroke={accentColor}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${size} 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color: accentColor }}>
                {size}%
              </span>
            </div>
          ))}
        </div>
      );

    case 'cards':
    default:
      // Card grid preview
      return (
        <div className="grid grid-cols-2 gap-1.5 w-full px-2">
          {[80, 65, 90, 45].map((h, i) => (
            <div key={i} className="bg-white rounded p-1.5 shadow-sm border border-gray-100">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${h}%`, backgroundColor: accentColor }} />
              </div>
            </div>
          ))}
        </div>
      );
  }
};

// Design Picker Component
const SkillsDesignPicker = ({ selectedDesign, onSelectDesign }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Choose Design Style</h3>
          <p className="text-sm text-gray-500">Select how your skills appear on your public profile</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SKILLS_DESIGNS.map((design) => (
          <button
            key={design.id}
            onClick={() => onSelectDesign(design)}
            className={`relative p-4 rounded-xl transition-all duration-200 ${design.preview} ${
              selectedDesign?.id === design.id
                ? 'ring-4 ring-purple-500 ring-offset-2 scale-105'
                : 'hover:scale-102 hover:shadow-lg'
            }`}
          >
            {selectedDesign?.id === design.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="h-16 flex items-center justify-center">
              <LayoutPreview design={design} />
            </div>
            <p className="text-xs font-semibold mt-2 text-center" style={{ color: design.textColor }}>
              {design.name}
            </p>
            <p className="text-[10px] text-gray-400 text-center">{design.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const SkillsSelection = ({ onNext, updateLiveSkills, savedProficiencies, setSavedProficiencies, savedCategories, setSavedCategories, savedDescriptions, setSavedDescriptions }) => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch skills already added in the database or AI-generated skills
    api.get('/career/skill/', {
      headers: { Authorization: `Token ${token}` },
      withCredentials: true,
    })
      .then((response) => {
        let dbSkills = [];
        let proficiencyMap = {};
        let categoryMap = {};
        let descriptionMap = {};
        if (Array.isArray(response.data)) {
          dbSkills = response.data.map((skill) => skill.name);
          // Store proficiency, category, and description values from database
          response.data.forEach((skill) => {
            proficiencyMap[skill.name] = skill.proficiency || 50;
            categoryMap[skill.name] = skill.category || 'other';
            descriptionMap[skill.name] = skill.description || '';
          });
        } else if (response.data.skills) {
          dbSkills = response.data.skills;
        }
        setSkills(dbSkills);
        setSelectedSkills(dbSkills);
        setSavedProficiencies(proficiencyMap);
        setSavedCategories(categoryMap);
        if (setSavedDescriptions) setSavedDescriptions(descriptionMap);
        // Update live preview
        if (updateLiveSkills) {
          updateLiveSkills(response.data);
        }
      })
      .catch((error) => console.error('Error fetching skills:', error));
  }, [setSavedProficiencies, setSavedCategories, updateLiveSkills]);

  const toggleSkill = async (skill) => {
    const token = localStorage.getItem('token');
    if (selectedSkills.includes(skill)) {
      // Deselecting - delete from database
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      try {
        await api.delete(`/career/skill/delete_by_name/`, {
          data: { name: skill },
          headers: { Authorization: `Token ${token}` },
        });
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    } else {
      // Selecting - add to database
      setSelectedSkills([...selectedSkills, skill]);
      try {
        await api.post('/career/skill/',
          { name: skill, proficiency: 50, category: 'other' },
          { headers: { Authorization: `Token ${token}` } }
        );
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  const handleAddCustomSkill = async () => {
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill !== '') {
      if (!skills.includes(trimmedSkill)) {
        setSkills([...skills, trimmedSkill]);
      }
      if (!selectedSkills.includes(trimmedSkill)) {
        setSelectedSkills([...selectedSkills, trimmedSkill]);
        // Save to database immediately
        try {
          const token = localStorage.getItem('token');
          await api.post('/career/skill/',
            { name: trimmedSkill, proficiency: 50, category: 'other' },
            { headers: { Authorization: `Token ${token}` } }
          );
        } catch (error) {
          console.error('Error adding custom skill:', error);
        }
      }
      setCustomSkill('');
    }
  };

  const handleNext = () => {
    onNext(selectedSkills);
  };

  const fetchSkills = () => {
    const token = localStorage.getItem('token');
    api.get('/career/skill/', {
      headers: { Authorization: `Token ${token}` },
      withCredentials: true,
    })
      .then((response) => {
        let dbSkills = [];
        if (Array.isArray(response.data)) {
          dbSkills = response.data.map((skill) => skill.name);
        } else if (response.data.skills) {
          dbSkills = response.data.skills;
        }
        setSkills(dbSkills);
        setSelectedSkills(dbSkills);
      })
      .catch((error) => console.error('Error fetching skills:', error));
  };

  const handleImportFromCV = async () => {
    setIsImporting(true);
    setImportMessage('');
    try {
      const response = await api.post('/ai/import-from-cv/', { section: 'skills' });
      if (response.data.success) {
        setImportMessage(`Imported ${response.data.imported.skills} skills from your CV!`);
        fetchSkills();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to import from CV';
      setImportMessage(errorMsg);
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportMessage(''), 5000);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Select Your Skills</h2>

      {/* Import from CV Button */}
      <div className="mb-4">
        <button
          onClick={handleImportFromCV}
          disabled={isImporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Importing Skills from CV...
            </>
          ) : (
            <>
              <FileText size={18} />
              Import Skills from CV
            </>
          )}
        </button>
        {importMessage && (
          <div className={`mt-2 p-2 rounded text-sm text-center ${
            importMessage.includes('Imported')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {importMessage}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <button
              key={index}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border shadow-md flex items-center gap-2 ${
                selectedSkills.includes(skill)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {selectedSkills.includes(skill) ? (
                <FaCheck className="text-white" />
              ) : (
                '+'
              )}{' '}
              {skill}
            </button>
          ))
        ) : (
          <p>Loading skills...</p>
        )}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          placeholder="Enter custom skill"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddCustomSkill}
          className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition-all"
        >
          Add Skill
        </button>
      </div>
      <button
        onClick={handleNext}
        disabled={selectedSkills.length === 0}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

const CATEGORY_OPTIONS = [
  { value: 'programming', label: 'Programming' },
  { value: 'tools', label: 'Tools & Software' },
  { value: 'design', label: 'Design' },
  { value: 'database', label: 'Database' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'other', label: 'Other' },
];

const ProficiencyForm = ({ selectedSkills, onSubmit, savedProficiencies, savedCategories, savedDescriptions, updateLiveSkills }) => {
  const [skillData, setSkillData] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    const initialData = {};
    selectedSkills.forEach((skill) => {
      // Use saved proficiency if available (convert 1-5 scale to 0-100)
      const savedProf = savedProficiencies[skill];
      const savedCat = savedCategories?.[skill] || 'other';
      const savedDesc = savedDescriptions?.[skill] || '';
      initialData[skill] = {
        proficiency: savedProf ? (savedProf <= 5 ? savedProf * 20 : savedProf) : 50,
        category: savedCat,
        description: savedDesc,
      };
    });
    setSkillData(initialData);
  }, [selectedSkills, savedProficiencies, savedCategories, savedDescriptions]);

  // Auto-save skill changes
  const autoSaveSkill = async (skillName, proficiency, category, description) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/career/skill/update_skill/',
        { name: skillName, proficiency, category, description: description || '' },
        { headers: { Authorization: `Token ${token}` } }
      );
      setSaveStatus(prev => ({ ...prev, [skillName]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [skillName]: '' })), 1500);

      // Update live preview - fetch fresh data
      if (updateLiveSkills) {
        const response = await api.get('/career/skill/', {
          headers: { Authorization: `Token ${token}` }
        });
        updateLiveSkills(Array.isArray(response.data) ? response.data : response.data.results || []);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setSaveStatus(prev => ({ ...prev, [skillName]: 'error' }));
    }
  };

  const handleChange = (skill, field, value) => {
    const newValue = field === 'proficiency' ? Number(value) : value;
    const newSkillData = {
      ...skillData,
      [skill]: {
        ...skillData[skill],
        [field]: newValue,
      },
    };
    setSkillData(newSkillData);

    // Auto-save after change (debounce description saves)
    const skillInfo = newSkillData[skill];
    if (field === 'description') {
      // Debounce description saves
      clearTimeout(window.skillDescriptionTimeout);
      window.skillDescriptionTimeout = setTimeout(() => {
        autoSaveSkill(skill, skillInfo.proficiency, skillInfo.category, skillInfo.description);
      }, 500);
    } else {
      autoSaveSkill(skill, skillInfo.proficiency, skillInfo.category, skillInfo.description);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(skillData);
  };

  // Get color based on proficiency
  const getColor = (proficiency) => {
    if (proficiency >= 80) return '#22c55e';
    if (proficiency >= 60) return '#3b82f6';
    if (proficiency >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-6 text-center">Set Your Proficiency Level</h2>
      <div className="space-y-6">
        {selectedSkills.map((skill, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-gray-800">{skill}</label>
              <span
                className="text-xl font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${getColor(skillData[skill]?.proficiency || 50)}20`,
                  color: getColor(skillData[skill]?.proficiency || 50),
                }}
              >
                {skillData[skill]?.proficiency || 50}%
              </span>
            </div>

            {/* Proficiency Slider */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={skillData[skill]?.proficiency || 50}
                onChange={(e) => handleChange(skill, 'proficiency', e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getColor(skillData[skill]?.proficiency || 50)} ${skillData[skill]?.proficiency || 50}%, #e5e7eb ${skillData[skill]?.proficiency || 50}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Category Selection */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Category:</label>
              <select
                value={skillData[skill]?.category || 'other'}
                onChange={(e) => handleChange(skill, 'category', e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes/Description Section */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center">
                    <span className="text-amber-600 text-xs">📝</span>
                  </span>
                  Skill Story / Notes
                </label>
                {saveStatus[skill] === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    ✓ Saved
                  </span>
                )}
              </div>
              <textarea
                value={skillData[skill]?.description || ''}
                onChange={(e) => handleChange(skill, 'description', e.target.value)}
                placeholder="Tell your story with this skill... How did you learn it? What projects have you used it in? Any certifications?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-amber-50/30"
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">
                This will show as a clickable story on your public profile
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
      >
        Save & Continue
      </button>
    </form>
  );
};

const SkillForm = () => {
  const navigate = useNavigate();
  const { updateLiveSkills, updateLiveSkillsDesign } = useContext(PreviewContext);
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [savedProficiencies, setSavedProficiencies] = useState({});
  const [savedCategories, setSavedCategories] = useState({});
  const [savedDescriptions, setSavedDescriptions] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(SKILLS_DESIGNS[0]);
  const [designSaving, setDesignSaving] = useState(false);

  // Fetch saved design on mount
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/career/skills-design/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.data?.design_config) {
          const savedDesign = SKILLS_DESIGNS.find(d => d.id === response.data.design_config.id);
          if (savedDesign) {
            setSelectedDesign(savedDesign);
          } else {
            setSelectedDesign(response.data.design_config);
          }
        }
      } catch (error) {
        console.log('No saved design, using default');
      }
    };
    fetchDesign();
  }, []);

  // Handle design selection
  const handleSelectDesign = async (design) => {
    setSelectedDesign(design);
    setDesignSaving(true);

    // Update live preview
    if (updateLiveSkillsDesign) {
      updateLiveSkillsDesign(design);
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/career/skills-design/update/',
        { design_config: design },
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setDesignSaving(false);
    }
  };

  // Move from skills selection to proficiency form
  const handleNext = (skills) => {
    setSelectedSkills(skills);
    setStep(2);
  };

  // Handler for final form submission
  const handleSubmit = async (data) => {
    // Convert skill data to an array of skill objects with category
    const skillsPayload = Object.entries(data).map(([name, skillInfo]) => ({
      name,
      proficiency: skillInfo.proficiency,
      category: skillInfo.category || 'other',
    }));

    try {
      const token = localStorage.getItem('token');
      await api.post(
        'career/skill/bulk_create/',
        { skills: skillsPayload },
        {
          headers: { Authorization: `Token ${token}` },
          withCredentials: true,
        }
      );
      // Navigate to awards after successful save
      navigate('/dashboard/awards');
    } catch (error) {
      console.error('Error submitting skills:', error);
      setSubmissionMessage('There was an error saving your skills.');
    }
  };

  return (
    <div className="relative bg-gray-100 p-4 pb-24">
      {/* Design Picker - Always visible */}
      <SkillsDesignPicker
        selectedDesign={selectedDesign}
        onSelectDesign={handleSelectDesign}
      />
      {designSaving && (
        <div className="text-center text-sm text-purple-600 mb-4">
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          Saving design...
        </div>
      )}

      {step === 1 && (
        <SkillsSelection
          onNext={handleNext}
          updateLiveSkills={updateLiveSkills}
          savedProficiencies={savedProficiencies}
          setSavedProficiencies={setSavedProficiencies}
          savedCategories={savedCategories}
          setSavedCategories={setSavedCategories}
          savedDescriptions={savedDescriptions}
          setSavedDescriptions={setSavedDescriptions}
        />
      )}
      {step === 2 && (
        <ProficiencyForm
          selectedSkills={selectedSkills}
          onSubmit={handleSubmit}
          savedProficiencies={savedProficiencies}
          savedCategories={savedCategories}
          savedDescriptions={savedDescriptions}
          updateLiveSkills={updateLiveSkills}
        />
      )}
      {submissionMessage && (
        <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-md rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Submission Status</h3>
          <p className="text-red-600">{submissionMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SkillForm;
