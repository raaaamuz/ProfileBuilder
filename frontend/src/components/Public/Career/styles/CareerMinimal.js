import { Calendar } from 'lucide-react';

/**
 * Minimal Career Style - Clean, lots of whitespace
 * Used by: Mini Profile template
 */
const CareerMinimal = ({ careerData = [] }) => {
  const displayData = careerData.length > 0 ? careerData : [
    { position: 'Senior Software Engineer', company: 'Google', start_date: '2022', end_date: 'Present', description: 'Leading cloud infrastructure development' },
    { position: 'Software Engineer', company: 'Microsoft', start_date: '2020', end_date: '2022', description: 'Azure platform development' },
  ];

  return (
    <div className="min-h-full bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-gray-900 mb-10">Experience</h2>

        <div className="space-y-8">
          {displayData.map((entry, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-6">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {entry.position || entry.title}
                </h3>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  {entry.start_date || entry.startDate} - {entry.end_date || entry.endDate || 'Present'}
                </span>
              </div>
              <p className="text-gray-500 mb-2">{entry.company}</p>
              {entry.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerMinimal;
