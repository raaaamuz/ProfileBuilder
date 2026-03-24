import { GraduationCap } from 'lucide-react';

/**
 * Glassmorphism Education Style
 */
const EducationGlassmorphism = ({ educationData = [], accentColor = '#00ff88', isAdminPreview = false }) => {
  const displayData = educationData.length > 0 ? educationData : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020' },
  ];

  return (
    <div className="min-h-full py-12 px-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <GraduationCap style={{ color: accentColor }} />
          Education
        </h2>
        <div className="space-y-4">
          {displayData.map((entry, index) => (
            <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{entry.degree || entry.course}</h3>
                  <p style={{ color: accentColor }}>{entry.institution || entry.school}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm">
                  {entry.year || entry.start_year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationGlassmorphism;
