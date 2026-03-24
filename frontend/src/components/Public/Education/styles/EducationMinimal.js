/**
 * Minimal Education Style
 */
const EducationMinimal = ({ educationData = [] }) => {
  const displayData = educationData.length > 0 ? educationData : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020' },
  ];

  return (
    <div className="min-h-full bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-10">Education</h2>
        <div className="space-y-6">
          {displayData.map((entry, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-6">
              <div className="text-sm text-gray-400 mb-1">{entry.year || entry.start_year}</div>
              <h3 className="text-lg font-medium text-gray-900">{entry.degree || entry.course}</h3>
              <p className="text-gray-500">{entry.institution || entry.school}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationMinimal;
