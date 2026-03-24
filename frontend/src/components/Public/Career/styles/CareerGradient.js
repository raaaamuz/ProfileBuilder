import { Briefcase, Calendar, MapPin } from 'lucide-react';

/**
 * Gradient Career Style - Bold gradient backgrounds, horizontal timeline
 * Used by: Elegance, Personal Shape templates
 */
const CareerGradient = ({ careerData = [], accentColor = '#a855f7', isAdminPreview = false }) => {
  return (
    <div
      className="min-h-full py-12 px-6"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        <h2 className="text-4xl font-bold text-white text-center mb-12 italic">
          Career Journey
        </h2>

        {/* Horizontal Timeline Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Timeline Line */}
          <div className="relative mb-8">
            <div
              className="absolute top-1/2 left-0 right-0 h-1 rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #ec4899)` }}
            />

            {/* Timeline Points */}
            <div className="flex justify-between relative">
              {careerData.slice(0, 4).map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10"
                    style={{ backgroundColor: index === 0 ? '#22c55e' : accentColor }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Career Entries Grid */}
          <div className="grid grid-cols-2 gap-6">
            {careerData.map((entry, index) => (
              <div key={index} className="text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {entry.position || entry.title || 'Position'}
                </h3>
                <p style={{ color: accentColor }} className="font-medium mb-1">
                  {entry.company || 'Company'}
                </p>
                <p className="text-gray-500 text-sm">
                  {entry.start_date || entry.startDate || '2020'} - {entry.end_date || entry.endDate || 'Present'}
                </p>
              </div>
            ))}
          </div>

          {careerData.length === 0 && (
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Senior Software Engineer</h3>
                <p style={{ color: accentColor }} className="font-medium mb-1">Google</p>
                <p className="text-gray-500 text-sm">2022 - Present</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Software Engineer</h3>
                <p style={{ color: accentColor }} className="font-medium mb-1">Microsoft</p>
                <p className="text-gray-500 text-sm">2020 - 2022</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerGradient;
