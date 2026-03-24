import { Briefcase, Calendar } from 'lucide-react';

/**
 * Dark Career Style - High contrast, neon accents, bold typography
 * Used by: Reflux, Starter Dark templates
 */
const CareerDark = ({ careerData = [], accentColor = '#00ff88', isAdminPreview = false }) => {
  const displayData = careerData.length > 0 ? careerData : [
    { position: 'Senior Software Engineer', company: 'Google', start_date: '2022', end_date: 'Present', description: 'Leading cloud infrastructure development' },
    { position: 'Software Engineer', company: 'Microsoft', start_date: '2020', end_date: '2022', description: 'Azure platform development' },
  ];

  return (
    <div className="min-h-full bg-gray-950 py-12 px-6">
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-3xl font-black text-white mb-10 tracking-tight">CAREER</h2>

        {/* Vertical Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />

          <div className="space-y-6">
            {displayData.map((entry, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline Dot */}
                <div
                  className="absolute left-2 w-5 h-5 rounded-full border-4 border-gray-950"
                  style={{
                    backgroundColor: index === 0 ? accentColor : '#4b5563',
                    boxShadow: index === 0 ? `0 0 20px ${accentColor}` : 'none'
                  }}
                />

                {/* Card */}
                <div className="bg-gray-900 rounded-xl p-6 border-l-4" style={{ borderColor: index === 0 ? accentColor : '#374151' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {entry.position || entry.title}
                        {index === 0 && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold"
                            style={{ backgroundColor: accentColor, color: '#0a0a0f' }}
                          >
                            CURRENT
                          </span>
                        )}
                      </h3>
                      <p style={{ color: accentColor }}>{entry.company}</p>
                    </div>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {entry.start_date || entry.startDate} - {entry.end_date || entry.endDate || 'Present'}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-gray-400 text-sm mt-3">{entry.description}</p>
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

export default CareerDark;
