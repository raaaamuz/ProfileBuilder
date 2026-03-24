import { Check, Eye } from 'lucide-react';

const TemplateCard = ({ template, isSelected, onSelect, onPreview }) => {
  // Get style-specific gradient backgrounds for preview - matches actual templates
  const getStyleGradient = (style) => {
    const gradients = {
      minimal: 'from-gray-50 to-white',           // Minimal: clean white
      dark: 'from-gray-950 to-gray-900',          // Cyber: dark with neon
      glassmorphism: 'from-slate-900 via-indigo-950 to-blue-950', // Glass: dark gradient
      gradient: 'from-purple-600 via-violet-600 to-purple-700',   // Gradient: purple/pink
      professional: 'from-slate-100 to-gray-200', // Classic: professional gray
      colorful: 'from-pink-400 via-purple-400 to-indigo-400',
    };
    return gradients[style] || gradients.minimal;
  };

  // Get accent color for each style
  const getAccentColor = (style) => {
    const accents = {
      minimal: 'bg-gray-400',
      dark: 'bg-green-400',        // Cyber neon green
      glassmorphism: 'bg-green-400', // Glass neon green
      gradient: 'bg-white',
      professional: 'bg-amber-500',  // Classic gold accent
      colorful: 'bg-pink-400',
    };
    return accents[style] || accents.minimal;
  };

  const gradient = getStyleGradient(template.style);

  return (
    <div
      onClick={() => onSelect(template)}
      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? 'ring-4 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-105'
          : 'hover:ring-2 hover:ring-purple-400/50'
      }`}
    >
      {/* Template Preview */}
      <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} p-4 flex flex-col relative group`}>
        {/* Preview Button - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview && onPreview();
          }}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium">
            <Eye size={18} />
            Preview
          </div>
        </button>

        {/* Mock Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-full ${template.style === 'minimal' ? 'bg-gray-400' : 'bg-white/30'}`} />
          <div className="flex-1">
            <div className={`h-2 w-20 rounded ${template.style === 'minimal' ? 'bg-gray-400' : 'bg-white/40'}`} />
            <div className={`h-1.5 w-14 rounded mt-1 ${template.style === 'minimal' ? 'bg-gray-300' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* Mock Content Cards */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className={`rounded-lg ${template.style === 'minimal' ? 'bg-white shadow-sm' : 'bg-white/10 backdrop-blur-sm'} p-2`}>
            <div className={`h-1.5 w-full rounded mb-1 ${template.style === 'minimal' ? 'bg-gray-300' : 'bg-white/30'}`} />
            <div className={`h-1 w-3/4 rounded ${template.style === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}`} />
          </div>
          <div className={`rounded-lg ${template.style === 'minimal' ? 'bg-white shadow-sm' : 'bg-white/10 backdrop-blur-sm'} p-2`}>
            <div className={`h-1.5 w-full rounded mb-1 ${template.style === 'minimal' ? 'bg-gray-300' : 'bg-white/30'}`} />
            <div className={`h-1 w-2/3 rounded ${template.style === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}`} />
          </div>
          <div className={`col-span-2 rounded-lg ${template.style === 'minimal' ? 'bg-white shadow-sm' : 'bg-white/10 backdrop-blur-sm'} p-2`}>
            <div className={`h-1 w-full rounded mb-1 ${template.style === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}`} />
            <div className={`h-1 w-5/6 rounded ${template.style === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}`} />
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-white/10 backdrop-blur-lg p-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm">{template.name}</h3>
            <span className="text-xs text-gray-400 capitalize">{template.style}</span>
          </div>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Selected Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-purple-500/10 pointer-events-none" />
      )}
    </div>
  );
};

export default TemplateCard;
