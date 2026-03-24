import { GraduationCap } from 'lucide-react';

/**
 * Gradient Education Style
 */
const EducationGradient = ({ educationData = [], accentColor = '#a855f7', isAdminPreview = false }) => {
  const displayData = educationData.length > 0 ? educationData : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020' },
  ];

  return (
    <div className="min-h-full py-12 px-6" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-3xl font-bold text-white text-center mb-10">Education</h2>
        <div className="space-y-4">
          {displayData.map((entry, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  <GraduationCap size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{entry.degree || entry.course}</h3>
                  <p className="text-purple-600">{entry.institution || entry.school}</p>
                </div>
                <span className="text-sm text-gray-500">{entry.year || entry.start_year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationGradient;
