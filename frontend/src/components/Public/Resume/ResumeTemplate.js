import React, { forwardRef } from "react";

const ResumeTemplate = forwardRef(({ data }, ref) => {
  // Destructure using camelCase keys to match your backend response
  const {
    homeContent,
    userProfile,
    careerEntries,
    educationEntries,
    customSettings,
    skills,
    achievements,
    interests,
    languages,
  } = data;

  // Retrieve the backend base URL from an environment variable
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  // Helper function to check if a string contains HTML tags
  const containsHTML = (str) => /<[^>]+>/.test(str);

  return (
    <div
      ref={ref}
      style={{ width: "210mm", height: "297mm" }}
      className="mx-auto bg-white shadow-md p-8 font-sans overflow-hidden"
    >
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-blue-700">
          {homeContent?.title || (userProfile && userProfile.name)}
        </h1>
        <p className="text-lg text-gray-600">
          {userProfile && userProfile.bio}
        </p>
        <hr className="my-4 border-t-2" />
      </header>

      <div className="grid grid-cols-10 gap-4">
        {/* Left Column */}
        <aside className="col-span-3 border-r pr-4">
          {userProfile && userProfile.profile_picture && (
            <img
              src={`${BASE_URL}${userProfile.profile_picture}`}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          )}
          <section className="mb-4">
            <h2 className="flex items-center text-xl font-semibold text-blue-600 border-b pb-1 mb-2">
              Contact
            </h2>
            {userProfile && (
              <>
                <p className="flex items-center text-sm text-gray-700">
                  {userProfile.email}
                </p>
                <p className="flex items-center text-sm text-gray-700">
                  {userProfile.phone}
                </p>
                <p className="flex items-center text-sm text-gray-700">
                  {userProfile.location}
                </p>
              </>
            )}
          </section>
          {skills && (
            <section className="mb-4">
              <h2 className="flex items-center text-xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Skills
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {skills.map((skill, index) => (
                  <li key={index}>{skill.name || skill}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" />
            </section>
          )}
          {interests && (
            <section className="mb-4">
              <h2 className="flex items-center text-xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Interests
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" />
            </section>
          )}
          {languages && (
            <section className="mb-4">
              <h2 className="flex items-center text-xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Languages
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {languages.map((lang, index) => (
                  <li key={index}>{lang}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" />
            </section>
          )}
          {educationEntries && educationEntries.length > 0 && (
            <section className="mb-4">
              <h2 className="flex items-center text-xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Education
              </h2>
              {educationEntries.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <h3 className="text-xl font-bold text-blue-800">
                    {edu.degree}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-blue-700">{edu.university}</p>
                    <span className="text-sm text-blue-700">{edu.year}</span>
                  </div>
                  {edu.description && (
                    <div
                      className="text-xs text-blue-700 mt-1"
                      dangerouslySetInnerHTML={
                        containsHTML(edu.description)
                          ? { __html: edu.description }
                          : undefined
                      }
                    >
                      {!containsHTML(edu.description) && edu.description}
                    </div>
                  )}
                  <hr className="my-2 border-t" />
                </div>
              ))}
              <hr className="my-4 border-t-2" />
            </section>
          )}
        </aside>

        {/* Right Column */}
        <main className="col-span-7 pl-4">
          {careerEntries && careerEntries.length > 0 && (
            <section className="mb-6">
              <h2 className="flex items-center text-2xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Career
              </h2>
              {careerEntries.map((job) => {
                const hasHtml = containsHTML(job.description);
                const getBulletPoints = (description) => {
                  if (description.includes("\n")) {
                    return description.split("\n");
                  }
                  return description.split(/(?<=[.?!])\s+(?=[A-Z])/);
                };

                return (
                  <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "#800000" }}
                      >
                        {job.title}
                      </h3>
                      <span className="text-sm text-gray-600">{job.year}</span>
                    </div>
                    <p className="text-sm" style={{ color: "#800000" }}>
                      {job.company}
                    </p>
                    {hasHtml ? (
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    ) : (
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2">
                        {getBulletPoints(job.description)
                          .filter((point) => point.trim().length > 0)
                          .map((bullet, index) => (
                            <li key={index}>{bullet.trim()}</li>
                          ))}
                      </ul>
                    )}
                    <hr className="my-2 border-t" />
                  </div>
                );
              })}
            </section>
          )}
          {achievements && (
            <section className="mb-6">
              <h2 className="flex items-center text-2xl font-semibold text-blue-600 border-b pb-1 mb-2">
                Achievements
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {achievements.map((ach, index) => (
                  <li key={index}>{ach}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" />
            </section>
          )}
        </main>
      </div>
    </div>
  );
});

export default ResumeTemplate;
