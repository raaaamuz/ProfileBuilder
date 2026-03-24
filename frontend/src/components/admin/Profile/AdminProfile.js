import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, Sparkles, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { HiSparkles } from 'react-icons/hi';
import { FiLoader } from 'react-icons/fi';
import api from '../../../services/api';
import './AdminProfile.css';
import { PreviewContext } from '../PreviewContext';

const parseBio = (bio, socialLinks) => {
  const fbLink = socialLinks.facebook || "https://www.facebook.com/yourprofile";
  const twLink = socialLinks.twitter || "https://twitter.com/yourprofile";
  const liLink = socialLinks.linkedin || "https://www.linkedin.com/in/yourprofile";
  let parsedBio = bio || '';

  parsedBio = parsedBio.replace(
    /{{\s*facebook\s*}}/gi,
    `<a class="social-reference" href="${fbLink}" target="_blank" rel="noopener noreferrer">Facebook</a>`
  );
  parsedBio = parsedBio.replace(
    /{{\s*twitter\s*}}/gi,
    `<a class="social-reference" href="${twLink}" target="_blank" rel="noopener noreferrer">Twitter</a>`
  );
  parsedBio = parsedBio.replace(
    /{{\s*linkedin\s*}}/gi,
    `<a class="social-reference" href="${liLink}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
  );
  return parsedBio;
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const { updateLiveProfile } = useContext(PreviewContext);

  const [profile, setProfile] = useState({
    display_name: '',
    email: '',
    phone: '',
    location: '',
    job_title: '',
    years_experience: '',
    bio: '',
    profile_picture: null,
    cv: null,
    facebook: '',
    twitter: '',
    linkedin: '',
    show_availability: true,
    show_download_cv: true,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [isImprovingBio, setIsImprovingBio] = useState(false);
  const [improvedBios, setImprovedBios] = useState([]);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [parseMessage, setParseMessage] = useState('');

  const bioTextareaRef = useRef(null);

  /**
   * UPDATE LIVE PREVIEW - PROFILE PICTURE HANDLING
   * ===============================================
   * IMPORTANT: Both profile_picture and profile_picture_preview must be passed:
   * - profile_picture: The saved image URL from backend (for fallback)
   * - profile_picture_preview: Current preview image (saved URL or new base64 upload)
   *
   * profilePicturePreview state contains:
   * - Saved image URL when profile loads from API
   * - Base64 data URL when user selects a new image
   *
   * Template components use: displayImage = profile_picture_preview || profile_picture
   * DO NOT MODIFY THIS WITHOUT UNDERSTANDING THE FULL FLOW
   * ===============================================
   */
  useEffect(() => {
    updateLiveProfile({
      ...profile,
      // Pass the preview image (could be saved URL or new base64 upload)
      profile_picture_preview: profilePicturePreview,
      // Also pass as profile_picture for templates that use it directly
      profile_picture: profilePicturePreview,
      name: profile.display_name || 'Your Name',
    });
  }, [profile, profilePicturePreview, updateLiveProfile]);

  // Fetch profile data and social media info
  useEffect(() => {
    api.get('/profile/user-profile/')
      .then(profileResponse => {
        if (Array.isArray(profileResponse.data) && profileResponse.data.length > 0) {
          const data = profileResponse.data[0];

          // Set the saved profile picture preview URL
          if (data.profile_picture) {
            const backendUrl = "http://localhost:8000";
            const imageUrl = data.profile_picture.startsWith('/media/')
              ? backendUrl + data.profile_picture
              : data.profile_picture;
            setProfilePicturePreview(imageUrl);
          }

          // Set the saved CV preview (filename from URL)
          if (data.cv) {
            const cvFilename = data.cv.split('/').pop();
            setCvPreview(cvFilename);
          }

          // Also fetch home content to get display name (title) and social links
          api.get('/home/')
            .then(homeResponse => {
              const homeTitle = homeResponse.data?.title || '';
              const displayName = (homeTitle && !homeTitle.toLowerCase().includes('welcome')) ? homeTitle : '';

              api.get('/home/social-media/')
                .then(socialResponse => {
                  const socialMedia = socialResponse.data.social_media || {};
                  setProfile({
                    display_name: displayName,
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    job_title: data.job_title || '',
                    years_experience: data.years_experience || '',
                    bio: data.bio || '',
                    profile_picture: null,
                    cv: null,
                    facebook: socialMedia.facebook || '',
                    twitter: socialMedia.twitter || '',
                    linkedin: socialMedia.linkedin || '',
                    show_availability: data.show_availability !== false,
                    show_download_cv: data.show_download_cv !== false,
                  });
                })
                .catch(err => {
                  console.log("Error fetching social media data:", err);
                  setProfile({
                    display_name: displayName,
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    job_title: data.job_title || '',
                    years_experience: data.years_experience || '',
                    bio: data.bio || '',
                    profile_picture: null,
                    cv: null,
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    show_availability: data.show_availability !== false,
                    show_download_cv: data.show_download_cv !== false,
                  });
                });
            })
            .catch(err => {
              console.log("Error fetching home data:", err);
              api.get('/home/social-media/')
                .then(socialResponse => {
                  const socialMedia = socialResponse.data.social_media || {};
                  setProfile({
                    display_name: '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    job_title: data.job_title || '',
                    years_experience: data.years_experience || '',
                    bio: data.bio || '',
                    profile_picture: null,
                    cv: null,
                    facebook: socialMedia.facebook || '',
                    twitter: socialMedia.twitter || '',
                    linkedin: socialMedia.linkedin || '',
                  });
                })
                .catch(() => {
                  setProfile({
                    display_name: '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    job_title: data.job_title || '',
                    years_experience: data.years_experience || '',
                    bio: data.bio || '',
                    profile_picture: null,
                    cv: null,
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                  });
                });
            });
        }
      })
      .catch(error => console.log("Error fetching profile data:", error));
  }, []);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Auto-save text fields with debounce
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const saveData = async () => {
      setIsSaving(true);

      try {
        // Save profile data
        const profileFormData = new FormData();
        profileFormData.append('email', profile.email || '');
        profileFormData.append('phone', profile.phone || '');
        profileFormData.append('location', profile.location || '');
        profileFormData.append('job_title', profile.job_title || '');
        profileFormData.append('years_experience', profile.years_experience || '');
        profileFormData.append('bio', profile.bio || '');

        await api.post('/profile/user-profile/', profileFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Save display name to home endpoint (social links are managed in AdminHome)
        if (profile.display_name) {
          const homeFormData = new FormData();
          homeFormData.append('title', profile.display_name);
          await api.post('/home/update/', homeFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save error:', error);
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [profile.display_name, profile.email, profile.phone, profile.location, profile.job_title, profile.years_experience, profile.bio]);

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    setProfile(prevState => ({
      ...prevState,
      [name]: file,
    }));

    if (name === 'profile_picture') {
      setProfilePicturePreview(URL.createObjectURL(file));
    } else if (name === 'cv') {
      setCvPreview(file.name);
    }

    // Immediately upload file to backend
    const formData = new FormData();
    formData.append(name, file);

    try {
      await api.post('/profile/user-profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(`${name} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${name}:`, error);
    }
  };

  const handleImproveBio = async () => {
    if (!profile.bio || profile.bio.trim() === "") {
      alert("Please enter a bio to improve.");
      return;
    }
    setIsImprovingBio(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("ai/improve-description/",
        { description: profile.bio },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.data && response.data.variations) {
        setImprovedBios(response.data.variations);
        setIsBioModalOpen(true);
      } else {
        alert("No improved variations were returned.");
      }
    } catch (error) {
      console.error("Error improving bio:", error);
      alert(`Failed to improve bio: ${error.response?.data?.detail || "Unknown error"}`);
    }
    setIsImprovingBio(false);
  };

  const handleSelectBio = (bio) => {
    setProfile((prev) => ({ ...prev, bio }));
    setIsBioModalOpen(false);
  };

  const handleParseCV = async () => {
    if (!cvPreview) {
      setParseMessage('Please upload a CV first');
      return;
    }

    setIsParsingCV(true);
    setParseMessage('');

    try {
      const response = await api.post('/profile/parse-cv/');
      const data = response.data;

      if (data.success && data.parsed_data) {
        // Update profile with parsed data
        const parsed = data.parsed_data;
        setProfile(prev => ({
          ...prev,
          display_name: parsed.name || prev.display_name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          location: parsed.location || prev.location,
          bio: parsed.summary || prev.bio,
        }));

        const imports = [];
        if (parsed.experience?.length) imports.push(`${parsed.experience.length} jobs`);
        if (parsed.education?.length) imports.push(`${parsed.education.length} education`);
        if (parsed.skills?.length) imports.push(`${parsed.skills.length} skills`);

        setParseMessage(`Profile auto-filled! Imported: ${imports.join(', ')}`);
      } else {
        setParseMessage(data.message || 'CV parsed but no data extracted');
      }
    } catch (error) {
      console.error('Error parsing CV:', error);
      setParseMessage('Failed to parse CV. Please try again.');
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('location', profile.location);
    formData.append('job_title', profile.job_title);
    formData.append('years_experience', profile.years_experience);
    formData.append('bio', profile.bio);
    formData.append('facebook', profile.facebook);
    formData.append('twitter', profile.twitter);
    formData.append('linkedin', profile.linkedin);
    formData.append('show_availability', profile.show_availability);
    formData.append('show_download_cv', profile.show_download_cv);
    if (profile.profile_picture) {
      formData.append('profile_picture', profile.profile_picture);
    }
    if (profile.cv) {
      formData.append('cv', profile.cv);
    }
    api.post('/profile/user-profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => {
        setSubmitted(true);
        // Navigate to next section (Education) after successful save
        navigate('/dashboard/education');
      })
      .catch(error => {
        console.error('There was an error submitting the profile!', error);
      });
  };

  const handleBioContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const insertPlaceholder = (placeholder) => {
    const textarea = bioTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBio = profile.bio.substring(0, start) + placeholder + profile.bio.substring(end);
      setProfile(prev => ({ ...prev, bio: newBio }));
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleClickOutside = () => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const parsedBio = parseBio(profile.bio, {
    facebook: profile.facebook,
    twitter: profile.twitter,
    linkedin: profile.linkedin,
  });

  return (
    <div
      className="relative bg-gray-100 p-8 pb-24"
      onClick={handleClickOutside}
    >
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Admin Profile</h1>
          <p className="mt-2 text-lg text-gray-600">Update your professional information and links.</p>
          {/* Auto-save indicator */}
          <div className="mt-2 text-sm">
            {isSaving ? (
              <span className="text-blue-600 flex items-center justify-center gap-1">
                <Loader2 size={14} className="animate-spin" /> Saving...
              </span>
            ) : lastSaved ? (
              <span className="text-green-600 flex items-center justify-center gap-1">
                <Check size={14} /> Auto-saved
              </span>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="display_name" className="text-lg font-semibold text-gray-700 mb-1">Display Name:</label>
              <input
                type="text"
                name="display_name"
                value={profile.display_name}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Your Full Name (shown on your profile)"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-semibold text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-lg font-semibold text-gray-700 mb-1">Phone:</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="+1 (555) 555-5555"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="location" className="text-lg font-semibold text-gray-700 mb-1">Location:</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="City, Country"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="job_title" className="text-lg font-semibold text-gray-700 mb-1">Job Title / Position:</label>
              <input
                type="text"
                name="job_title"
                value={profile.job_title}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="e.g., Data Specialist, Software Engineer"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="years_experience" className="text-lg font-semibold text-gray-700 mb-1">Years of Experience:</label>
              <input
                type="text"
                name="years_experience"
                value={profile.years_experience}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="e.g., 10+ Years Exp"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="bio" className="text-lg font-semibold text-gray-700" style={{ margin: 0 }}>Bio</label>
                <button
                  type="button"
                  onClick={handleImproveBio}
                  disabled={isImprovingBio}
                  title="Enhance with AI"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '6px',
                    border: 'none',
                    background: isImprovingBio
                      ? '#334155'
                      : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
                    color: '#ffffff',
                    cursor: isImprovingBio ? 'not-allowed' : 'pointer',
                    opacity: isImprovingBio ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: isImprovingBio ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {isImprovingBio ? (
                    <>
                      <FiLoader className="animate-spin" style={{ width: '14px', height: '14px' }} />
                      <span>Improving...</span>
                    </>
                  ) : (
                    <>
                      <HiSparkles style={{ width: '14px', height: '14px' }} />
                      <span>AI Enhance</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="bio-textarea"
                name="bio"
                ref={bioTextareaRef}
                value={profile.bio}
                onChange={handleChange}
                onContextMenu={handleBioContextMenu}
                placeholder="Write your bio here..."
                required
                className="w-full px-4 py-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
              ></textarea>
            </div>
          </div>

          {contextMenu.visible && (
            <div
              className="custom-context-menu bg-white border border-gray-200 shadow-xl rounded-md py-2"
              style={{
                position: 'fixed',
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 1000,
              }}
            >
              <div
                className="context-menu-item px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                onClick={() => insertPlaceholder('{{facebook}}')}
              >
                <i className="fab fa-facebook-f mr-2"></i> Insert Facebook Link
              </div>
              <div
                className="context-menu-item px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                onClick={() => insertPlaceholder('{{twitter}}')}
              >
                <i className="fab fa-twitter mr-2"></i> Insert Twitter Link
              </div>
              <div
                className="context-menu-item px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                onClick={() => insertPlaceholder('{{linkedin}}')}
              >
                <i className="fab fa-linkedin-in mr-2"></i> Insert LinkedIn Link
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1">Profile Picture</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {profilePicturePreview && (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }} className="truncate max-w-[150px]" title={profilePicturePreview.split('/').pop()}>
                    {profilePicturePreview.split('/').pop()}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1">CV</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {cvPreview && (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }} className="truncate max-w-[150px]" title={cvPreview}>
                    {cvPreview}
                  </span>
                )}
              </div>
              {parseMessage && (
                <p className={`mt-2 text-sm ${parseMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {parseMessage}
                </p>
              )}
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">👁️</span> Public Profile Settings
            </h3>
            <div className="space-y-4">
              {/* Show Availability Badge */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-gray-700">Show "Available for opportunities"</p>
                  <p className="text-sm text-gray-500">Display the green availability badge on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.show_availability}
                    onChange={(e) => setProfile({ ...profile, show_availability: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Show Download CV Button */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-gray-700">Show "Download CV" button</p>
                  <p className="text-sm text-gray-500">Allow visitors to download your resume</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.show_download_cv}
                    onChange={(e) => setProfile({ ...profile, show_download_cv: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {submitted && (
            <p className="mt-4 text-center text-green-600 font-semibold">
              Profile submitted successfully!
            </p>
          )}
        </form>
      </div>

      {/* Modal for AI improved bio */}
      <Dialog
        open={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className="w-full max-w-lg mx-auto rounded-lg shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid #334155' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                >
                  <Sparkles size={16} style={{ color: '#6366f1' }} />
                </div>
                <Dialog.Title style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 600 }}>
                  AI Suggestions
                </Dialog.Title>
              </div>
              <button
                onClick={() => setIsBioModalOpen(false)}
                className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                style={{ color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>
                Select a bio to use:
              </p>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {improvedBios.map((bio, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectBio(bio)}
                    className="p-3 rounded-md cursor-pointer transition-all text-sm"
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      color: '#e2e8f0'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.backgroundColor = '#0f172a';
                    }}
                  >
                    {bio}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="px-5 py-3 flex justify-end"
              style={{ borderTop: '1px solid #334155' }}
            >
              <button
                onClick={() => setIsBioModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                style={{ backgroundColor: '#334155', color: '#94a3b8' }}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminProfile;