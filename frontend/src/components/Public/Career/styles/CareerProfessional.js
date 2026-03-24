import { Building, Calendar } from 'lucide-react';

/**
 * Professional Career Style - Classic, formal
 * Used by: Reflux template
 */
const CareerProfessional = ({ careerData = [] }) => {
  const displayData = careerData.length > 0 ? careerData : [
    { position: 'Senior Software Engineer', company: 'Google', start_date: '2022', end_date: 'Present', description: 'Leading cloud infrastructure development' },
    { position: 'Software Engineer', company: 'Microsoft', start_date: '2020', end_date: '2022', description: 'Azure platform development' },
  ];

  return (
    <div className="min-h-full bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          <h2 className="text-xl font-serif text-slate-800 mb-6 pb-3 border-b-2 border-slate-800">
            Professional Experience
          </h2>

          <div className="space-y-8">
            {displayData.map((entry, index) => (
              <div key={index} className={index > 0 ? 'pt-8 border-t border-slate-100' : ''}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                    <Building size={20} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-800 text-lg">{entry.position || entry.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar size={14} />
                        {entry.start_date} - {entry.end_date || 'Present'}
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium">{entry.company}</p>
                    {entry.description && (
                      <p className="text-sm text-slate-500 mt-2">{entry.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerProfessional;
