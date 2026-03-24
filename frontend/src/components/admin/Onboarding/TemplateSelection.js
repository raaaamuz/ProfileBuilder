import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, ArrowRight, Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../services/api';
import TemplateCard from './TemplateCard';
import TemplatePreviewModal from './TemplatePreviewModal';

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3; // Show 3 templates at a time

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates/');
      setTemplates(response.data);
      // Auto-select first template
      if (response.data.length > 0) {
        setSelectedTemplate(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = async () => {
    if (!selectedTemplate) {
      setError('Please select a template to continue');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await api.post('/templates/user/select/',
        { template_id: selectedTemplate.id },
        { headers: { Authorization: `Token ${token}` } }
      );

      // Force reload to ensure PreviewContext loads the new template
      window.location.href = '/dashboard/home';
    } catch (err) {
      console.error('Error selecting template:', err);
      setError('Failed to save template selection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    // Navigate without selecting a template
    navigate('/dashboard/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-purple-400 mx-auto mb-4" size={48} />
          <p className="text-gray-300">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-4">
            <Palette className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Design</h1>
          <p className="text-gray-300 max-w-md mx-auto">
            Select a template that matches your style. You can customize it further with AI-generated designs later.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Template Carousel */}
        <div className="relative mb-8">
          {/* Left Arrow */}
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Templates Slider */}
          <div className="overflow-hidden mx-8">
            <div
              className="flex gap-4 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount + 1.5)}%)` }}
            >
              {templates.map((template) => (
                <div key={template.id} className="flex-shrink-0" style={{ width: `calc((100% - 2rem) / ${visibleCount})` }}>
                  <TemplateCard
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onSelect={handleSelectTemplate}
                    onPreview={() => setPreviewTemplate(template)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentIndex(Math.min(templates.length - visibleCount, currentIndex + 1))}
            disabled={currentIndex >= templates.length - visibleCount}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(templates.length - visibleCount + 1) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? 'bg-purple-500 w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onSelect={(template) => {
              setSelectedTemplate(template);
              setPreviewTemplate(null);
            }}
          />
        )}

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {selectedTemplate.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {selectedTemplate.style}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI-ready
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      Customizable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-white/5 transition-all font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedTemplate || isSaving}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">{templates.length}</div>
            Templates
          </div>
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">AI</div>
            Design variations
          </div>
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">100%</div>
            Customizable
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
