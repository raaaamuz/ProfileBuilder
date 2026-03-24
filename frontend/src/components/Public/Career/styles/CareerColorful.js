import { Briefcase, Rocket } from 'lucide-react';

/**
 * Colorful Career Style - Vibrant, playful
 * Used by: First Portfolio template
 */
const CareerColorful = ({ careerData = [] }) => {
  const displayData = careerData.length > 0 ? careerData : [
    { position: 'Senior Software Engineer', company: 'Google', start_date: '2022', end_date: 'Present' },
    { position: 'Software Engineer', company: 'Microsoft', start_date: '2020', end_date: '2022' },
  ];

  const colors = ['#f472b6', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b'];

  return (
    <div className="min-h-full py-12 px-6" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
          <Rocket className="text-pink-500" /> Career Journey
        </h2>

        <div className="space-y-4">
          {displayData.map((entry, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-[1.02] transition-transform"
              style={{ borderLeft: `6px solid ${colors[index % colors.length]}` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${colors[index % colors.length]}20` }}
                >
                  {index === 0 ? '🚀' : '💼'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{entry.position || entry.title}</h3>
                  <p style={{ color: colors[index % colors.length] }} className="font-medium">
                    {entry.company} • {entry.start_date} - {entry.end_date || 'Present'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerColorful;
