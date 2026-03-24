/**
 * Colorful Education Style
 */
const EducationColorful = ({ educationData = [] }) => {
  const displayData = educationData.length > 0 ? educationData : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020' },
  ];
  const colors = ['from-indigo-400 to-indigo-600', 'from-pink-400 to-pink-600', 'from-green-400 to-green-600'];

  return (
    <div className="min-h-full py-12 px-6" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Education</h2>
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-purple-300">
          <div className="flex gap-4">
            {displayData.map((entry, index) => (
              <div key={index} className={`flex-1 bg-gradient-to-b ${colors[index % colors.length]} rounded-lg p-4 text-white transform ${index % 2 === 0 ? '-rotate-2' : 'rotate-2'} hover:rotate-0 transition-transform`}>
                <div className="text-xs mb-2">{entry.year || entry.start_year}</div>
                <h3 className="font-bold text-sm leading-tight">{entry.degree || entry.course}</h3>
                <p className="text-white/80 text-xs mt-2">{entry.institution || entry.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationColorful;
