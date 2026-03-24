/**
 * Dark Education Style
 */
const EducationDark = ({ educationData = [], accentColor = '#00ff88', isAdminPreview = false }) => {
  const displayData = educationData.length > 0 ? educationData : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020' },
  ];

  return (
    <div className="min-h-full bg-gray-950 py-12 px-6">
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-3xl font-black text-white mb-10 tracking-tight">EDUCATION</h2>
        <div className="space-y-4">
          {displayData.map((entry, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6 border-l-4" style={{ borderColor: accentColor }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{entry.degree || entry.course}</h3>
                  <p style={{ color: accentColor }}>{entry.institution || entry.school}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
                  {entry.year || entry.start_year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationDark;
