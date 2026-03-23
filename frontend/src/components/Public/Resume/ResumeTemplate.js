import React, { forwardRef } from "react";
import { getTemplateColors, getTemplateStyles, isDarkTheme } from "../../../config/resumeTemplates";

const ResumeTemplate = forwardRef(({ data, template = "professional" }, ref) => {
  // Get template colors and styles
  const colors = getTemplateColors(template);
  const styles = getTemplateStyles(template);
  const isDark = isDarkTheme(template);

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
      style={{
        width: "210mm",
        height: "297mm",
        backgroundColor: isDark ? styles.mainBg : "#ffffff"
      }}
      className="mx-auto shadow-md p-8 font-sans overflow-hidden"
    >
      {/* Header Section */}
      <header className="mb-6">
        <h1
          className="text-4xl font-bold"
          style={{ color: colors.primary }}
        >
          {homeContent?.title || (userProfile && userProfile.name)}
        </h1>
        <p
          className="text-lg"
          style={{ color: styles.subtextColor }}
        >
          {userProfile && userProfile.bio}
        </p>
        <hr
          className="my-4 border-t-2"
          style={{ borderColor: colors.accent }}
        />
      </header>

      <div className="grid grid-cols-10 gap-4">
        {/* Left Column (Sidebar) */}
        <aside
          className="col-span-3 pr-4"
          style={{
            borderRight: `1px solid ${colors.accent}`,
            backgroundColor: styles.sidebarBg
          }}
        >
          {userProfile && userProfile.profile_picture && (
            <img
              src={`${BASE_URL}${userProfile.profile_picture}`}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-4"
              style={{ border: `3px solid ${colors.secondary}` }}
            />
          )}

          {/* Contact Section */}
          <section className="mb-4">
            <h2
              className="flex items-center text-xl font-semibold border-b pb-1 mb-2"
              style={{ color: colors.secondary, borderColor: colors.accent }}
            >
              Contact
            </h2>
            {userProfile && (
              <>
                <p className="flex items-center text-sm" style={{ color: styles.textColor }}>
                  {userProfile.email}
                </p>
                <p className="flex items-center text-sm" style={{ color: styles.textColor }}>
                  {userProfile.phone}
                </p>
                <p className="flex items-center text-sm" style={{ color: styles.textColor }}>
                  {userProfile.location}
                </p>
              </>
            )}
          </section>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section className="mb-4">
              <h2
                className="flex items-center text-xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
                Skills
              </h2>
              <ul className="list-disc list-inside text-sm" style={{ color: styles.textColor }}>
                {skills.map((skill, index) => (
                  <li key={index}>{skill.name || skill}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" style={{ borderColor: colors.accent }} />
            </section>
          )}

          {/* Interests Section */}
          {interests && interests.length > 0 && (
            <section className="mb-4">
              <h2
                className="flex items-center text-xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
                Interests
              </h2>
              <ul className="list-disc list-inside text-sm" style={{ color: styles.textColor }}>
                {interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" style={{ borderColor: colors.accent }} />
            </section>
          )}

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <section className="mb-4">
              <h2
                className="flex items-center text-xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
                Languages
              </h2>
              <ul className="list-disc list-inside text-sm" style={{ color: styles.textColor }}>
                {languages.map((lang, index) => (
                  <li key={index}>{lang}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" style={{ borderColor: colors.accent }} />
            </section>
          )}

          {/* Education Section */}
          {educationEntries && educationEntries.length > 0 && (
            <section className="mb-4">
              <h2
                className="flex items-center text-xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
                Education
              </h2>
              {educationEntries.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {edu.degree}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm" style={{ color: colors.secondary }}>
                      {edu.university}
                    </p>
                    <span className="text-sm" style={{ color: colors.secondary }}>
                      {edu.year}
                    </span>
                  </div>
                  {edu.description && (
                    <div
                      className="text-xs mt-1"
                      style={{ color: styles.subtextColor }}
                      dangerouslySetInnerHTML={
                        containsHTML(edu.description)
                          ? { __html: edu.description }
                          : undefined
                      }
                    >
                      {!containsHTML(edu.description) && edu.description}
                    </div>
                  )}
                  <hr className="my-2 border-t" style={{ borderColor: colors.accent }} />
                </div>
              ))}
              <hr className="my-4 border-t-2" style={{ borderColor: colors.accent }} />
            </section>
          )}
        </aside>

        {/* Right Column (Main Content) */}
        <main
          className="col-span-7 pl-4"
          style={{ backgroundColor: isDark ? styles.mainBg : "transparent" }}
        >
          {/* Career Section */}
          {careerEntries && careerEntries.length > 0 && (
            <section className="mb-6">
              <h2
                className="flex items-center text-2xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
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
                        style={{ color: colors.primary }}
                      >
                        {job.title}
                      </h3>
                      <span className="text-sm" style={{ color: styles.subtextColor }}>
                        {job.year}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: colors.secondary }}>
                      {job.company}
                    </p>
                    {hasHtml ? (
                      <div
                        className="text-sm"
                        style={{ color: styles.textColor }}
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    ) : (
                      <ul className="list-disc ml-5 text-sm space-y-2" style={{ color: styles.textColor }}>
                        {getBulletPoints(job.description)
                          .filter((point) => point.trim().length > 0)
                          .map((bullet, index) => (
                            <li key={index}>{bullet.trim()}</li>
                          ))}
                      </ul>
                    )}
                    <hr className="my-2 border-t" style={{ borderColor: colors.accent }} />
                  </div>
                );
              })}
            </section>
          )}

          {/* Achievements Section */}
          {achievements && achievements.length > 0 && (
            <section className="mb-6">
              <h2
                className="flex items-center text-2xl font-semibold border-b pb-1 mb-2"
                style={{ color: colors.secondary, borderColor: colors.accent }}
              >
                Achievements
              </h2>
              <ul className="list-disc list-inside text-sm" style={{ color: styles.textColor }}>
                {achievements.map((ach, index) => (
                  <li key={index}>{ach}</li>
                ))}
              </ul>
              <hr className="my-4 border-t-2" style={{ borderColor: colors.accent }} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
});

export default ResumeTemplate;
