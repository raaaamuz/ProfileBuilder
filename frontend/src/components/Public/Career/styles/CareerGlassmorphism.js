import { Calendar, Building } from 'lucide-react';

/**
 * Glassmorphism Career Style - Glass blur effects, neon accents
 * Used by: Nexaverse, Glossy Touch templates
 */
const CareerGlassmorphism = ({ careerData = [], accentColor = '#00ff88', isAdminPreview = false }) => {
  const displayData = careerData.length > 0 ? careerData : [
    { position: 'Senior Software Engineer', company: 'Google', start_date: '2022', end_date: 'Present', description: 'Leading cloud infrastructure' },
    { position: 'Software Engineer', company: 'Microsoft', start_date: '2020', end_date: '2022', description: 'Azure development' },
  ];

  return (
    <div
      className="min-h-full py-12 px-6"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Building style={{ color: accentColor }} />
          Career
        </h2>

        {/* Glass Timeline */}
        <div className="relative">
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}
          />

          <div className="space-y-6">
            {displayData.map((entry, index) => (
              <div key={index} className="relative pl-16">
                <div
                  className="absolute left-4 w-5 h-5 rounded-full shadow-lg"
                  style={{
                    backgroundColor: index === 0 ? accentColor : 'rgba(255,255,255,0.3)',
                    boxShadow: index === 0 ? `0 0 20px ${accentColor}` : 'none'
                  }}
                />

                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {entry.position || entry.title}
                    </h3>
                    <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {entry.start_date} - {entry.end_date || 'Present'}
                    </div>
                  </div>
                  <p style={{ color: accentColor }} className="font-medium">{entry.company}</p>
                  {entry.description && (
                    <p className="text-white/60 text-sm mt-3">{entry.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGlassmorphism;
