import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "./RichTextEditor";
import api from "../../../services/api";
import { PreviewContext } from "../PreviewContext";
import {
  FileText, Plus, Edit3, Trash2, Image, Upload, Search,
  Loader2, X, ChevronLeft, ChevronRight, Calendar, List, Eye
} from "lucide-react";

const formTabs = [
  { label: "Create Post", key: "create", icon: Plus, description: "Write new content" },
  { label: "Published Posts", key: "posts", icon: List, description: "Manage your posts" },
];

// Replace with your actual Pexels API key or use an environment variable.
const PEXELS_API_KEY = "qbeAdhINGLmggzdNrK7x9KW4ZdHMKOdgxXDejtwHElbXAkbh8kuYcb0M";

const BlogContentManager = () => {
  const { updateLiveBlog, updateLiveBlogList } = useContext(PreviewContext);
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // file upload image
  const [imagePreview, setImagePreview] = useState(null);
  // Instead of storing just the URL, we'll store the full photo object when selected.
  const [selectedPexelsPhoto, setSelectedPexelsPhoto] = useState(null);
  const [pexelsImages, setPexelsImages] = useState([]);
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [selectedPreviewId, setSelectedPreviewId] = useState(null); // Track which post is shown in preview
  const [apiPage, setApiPage] = useState(1); // For API pagination if needed
  const [localPexelsPage, setLocalPexelsPage] = useState(1); // For local pagination of 10 images

  // Fetch posts from backend on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blog/posts/");
        const fetchedPosts = Array.isArray(response.data) ? response.data : response.data.results || [];
        setPosts(fetchedPosts);
        updateLiveBlogList(fetchedPosts);
        // Set first blog post as default preview
        if (fetchedPosts.length > 0) {
          updateLiveBlog(fetchedPosts[0]);
          setSelectedPreviewId(fetchedPosts[0].id);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, [updateLiveBlog, updateLiveBlogList]);

  // Handle selecting a post for preview
  const handlePreviewSelect = (post) => {
    setSelectedPreviewId(post.id);
    updateLiveBlog(post);
  };

  // Handle file upload image change and preview generation
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      if (file.name.length > 100) {
        const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
        const baseName = file.name.substring(0, 90);
        const newFileName = `${baseName}.${ext}`;
        file = new File([file], newFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });
      }
      setImage(file);
      setSelectedPexelsPhoto(null); // clear any selected Pexels image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image selection from Pexels results.
  // We now accept the full photo object and store its high-res image URL.
  const handlePexelsImageSelect = (photo) => {
    setSelectedPexelsPhoto(photo);
    setImage(null); // clear file upload if any
    // Use the original or large2x URL for preview and later download.
    setImagePreview(photo.src.original || photo.src.large2x);
  };

  // Helper function to generate keywords from content
  const generateKeywords = async () => {
    try {
      const response = await api.post("/ai/image-keywords/", { content });
      if (response.data.keywords) {
        return response.data.keywords.join(", ");
      }
    } catch (error) {
      console.error("Error generating keywords:", error);
    }
    return "";
  };

  // Search for images on Pexels based on keywords.
  // Now fetch 30 images per API request.
  const handlePexelsSearch = async (pageToUse = apiPage) => {
    setPexelsLoading(true);
    let query = customQuery.trim();
    if (!query && content) {
      query = await generateKeywords();
    }
    if (!query) {
      setPexelsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&page=${pageToUse}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      const data = await response.json();
      if (data && data.photos) {
        setPexelsImages(data.photos);
        // Reset local pagination when new images are fetched.
        setLocalPexelsPage(1);
      }
    } catch (error) {
      console.error("Error fetching images from Pexels:", error);
    } finally {
      setPexelsLoading(false);
    }
  };

  // Trigger image search when leaving the content editor
  const handleContentBlur = () => {
    if (!customQuery.trim()) {
      // Reset to page 1 when doing an automatic search.
      setApiPage(1);
      handlePexelsSearch(1);
    }
  };

  // Fill form with the selected post data for editing
  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content);
    setImagePreview(post.image || null);
    setImage(null);
    setSelectedPexelsPhoto(null);
    setActiveTab("create"); // Switch to create tab for editing
  };

  // Save or update the blog post to the backend and update local state
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
  
    if (image) {
      formData.append("image", image);
    } else if (selectedPexelsPhoto) {
      try {
        const imgUrl = selectedPexelsPhoto.src.original || selectedPexelsPhoto.src.large2x;
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const urlParts = imgUrl.split("/");
        const fileName = urlParts[urlParts.length - 1].split("?")[0] || "pexels_image.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        formData.append("image", file);
      } catch (error) {
        console.error("Error downloading Pexels image:", error);
      }
    }
  
    try {
      let savedPost;
      if (editingPostId) {
        const response = await api.put(`/blog/posts/${editingPostId}/`, formData);
        savedPost = response.data;
        const updatedPosts = posts.map((post) => (post.id === editingPostId ? savedPost : post));
        setPosts(updatedPosts);
        updateLiveBlogList(updatedPosts);
        setEditingPostId(null);
      } else {
        const response = await api.post("/blog/posts/", formData);
        savedPost = response.data;
        const updatedPosts = [savedPost, ...posts];
        setPosts(updatedPosts);
        updateLiveBlogList(updatedPosts);
      }

      // Show newly published/updated post in preview
      updateLiveBlog(savedPost);
      setSelectedPreviewId(savedPost.id);

      // Reset form fields
      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);
      setSelectedPexelsPhoto(null);
      setImagePreview(null);
      setPexelsImages([]);
      setCustomQuery("");
      setApiPage(1);
      setLocalPexelsPage(1);

      // Switch to posts tab to show the published post
      setActiveTab("posts");
    } catch (error) {
      console.error("Error saving blog post:", error);
    }
  };

  // Remove post from backend and update local state
  const handleDelete = async (id) => {
    try {
      await api.delete(`/blog/posts/${id}/`);
      setPosts(posts.filter((post) => post.id !== id));
      if (editingPostId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Cancel editing and clear form
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setTitle("");
    setCategory("");
    setContent("");
    setImage(null);
    setSelectedPexelsPhoto(null);
    setImagePreview(null);
    setPexelsImages([]);
    setCustomQuery("");
  };

  // Calculate the images to show on the current local page (10 per page)
  const startIndex = (localPexelsPage - 1) * 10;
  const endIndex = localPexelsPage * 10;
  const imagesToShow = pexelsImages.slice(startIndex, endIndex);
  const totalLocalPages = Math.ceil(pexelsImages.length / 10);

  // Category badge colors
  const categoryColors = {
    Blogs: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Stories: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    Projects: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

  const getCategoryStyle = (cat) => categoryColors[cat] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

  // Dark theme colors
  const theme = {
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accent: '#10b981',
    border: '#334155',
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>Blog Manager</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Create and manage your blog posts, stories, and projects</p>
      </div>

      <div className="w-full max-w-4xl mx-auto p-5 rounded-xl" style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}>
        {/* Tab Navigation */}
        <div className="rounded-lg p-1 mb-5" style={{ backgroundColor: theme.bgPrimary }}>
          <div className="flex gap-2">
            {formTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={isActive ? {
                    background: 'linear-gradient(to right, #10b981, #14b8a6)',
                    color: '#ffffff',
                  } : {
                    color: theme.textSecondary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseOver={(e) => !isActive && (e.currentTarget.style.backgroundColor = theme.bgTertiary)}
                  onMouseOut={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Icon size={20} />
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: isActive ? '#ffffff' : theme.textPrimary }}>{tab.label}</div>
                    <div className="text-xs" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : theme.textSecondary }}>{tab.description}</div>
                  </div>
                  {tab.key === "posts" && posts.length > 0 && (
                    <span
                      className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isActive ? '#ffffff' : '#10b981'
                      }}
                    >
                      {posts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Create/Edit Post Tab */}
        {activeTab === "create" && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.bgTertiary, border: `1px solid ${theme.border}` }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
              {editingPostId ? (
                <>
                  <Edit3 style={{ color: '#f59e0b' }} size={20} />
                  <h2 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Edit Post</h2>
                </>
              ) : (
                <>
                  <Plus style={{ color: theme.accent }} size={20} />
                  <h2 className="text-base font-semibold" style={{ color: theme.textPrimary }}>New Post</h2>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Title</label>
                  <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg transition-all outline-none"
                    style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg transition-all outline-none"
                    style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                  >
                    <option value="">Select Category</option>
                    <option value="Blogs">Blogs</option>
                    <option value="Stories">Stories</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>
              </div>

              {/* Content Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Content</label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  onBlur={handleContentBlur}
                  placeholder="Write your content here..."
                />
              </div>

              {/* Image Section - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                    <div className="flex items-center gap-2">
                      <Image size={16} />
                      Featured Image
                    </div>
                  </label>
                  <label
                    className="cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all h-32"
                    style={{ borderColor: theme.border, backgroundColor: theme.bgSecondary }}
                    htmlFor="dropzone-file"
                  >
                    <Upload className="w-6 h-6 mb-1" style={{ color: theme.textSecondary }} />
                    <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Upload image</p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>PNG, JPG, GIF up to 10MB</p>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Preview</label>
                  {imagePreview ? (
                    <div className="relative h-32 rounded-lg overflow-hidden" style={{ border: `2px solid ${theme.border}` }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setSelectedPexelsPhoto(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 rounded-lg border-2 border-dashed flex items-center justify-center text-sm" style={{ borderColor: theme.border, color: theme.textSecondary }}>
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              {/* Loading indicator */}
              {pexelsLoading && (
                <div className="flex items-center justify-center py-4" style={{ color: theme.textSecondary }}>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  <span className="text-sm">Searching for images...</span>
                </div>
              )}

              {/* Pexels Images */}
              {pexelsImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: theme.textSecondary }}>
                      <Search size={14} />
                      Suggested Images from Pexels
                    </h3>
                    <span className="text-xs" style={{ color: theme.textSecondary }}>
                      Page {localPexelsPage}/{totalLocalPages}
                    </span>
                  </div>
                  <div className="grid grid-cols-10 gap-2">
                    {imagesToShow.map((photo) => (
                      <motion.img
                        key={photo.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        src={photo.src.small}
                        alt={photo.photographer}
                        className="cursor-pointer rounded-lg aspect-square object-cover border-2 transition-all"
                        style={{
                          borderColor: selectedPexelsPhoto && selectedPexelsPhoto.id === photo.id ? theme.accent : 'transparent'
                        }}
                        onClick={() => handlePexelsImageSelect(photo)}
                      />
                    ))}
                  </div>
                  {totalLocalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLocalPexelsPage((prev) => Math.max(prev - 1, 1))}
                        disabled={localPexelsPage === 1}
                        className="p-2 rounded-lg disabled:opacity-50 transition-all"
                        style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalPexelsPage((prev) => Math.min(prev + 1, totalLocalPages))}
                        disabled={localPexelsPage === totalLocalPages}
                        className="p-2 rounded-lg disabled:opacity-50 transition-all"
                        style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(to right, #10b981, #14b8a6)' }}
                  className="flex-1 py-2.5 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {editingPostId ? (
                    <>
                      <Edit3 size={18} />
                      Update Post
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Publish Post
                    </>
                  )}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 font-semibold rounded-lg transition-all flex items-center gap-2"
                    style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Published Posts Tab */}
        {activeTab === "posts" && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.bgTertiary, border: `1px solid ${theme.border}` }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <div className="flex items-center gap-2">
                <List style={{ color: theme.accent }} size={20} />
                <h2 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Published Posts</h2>
              </div>
              <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: theme.accent }}>
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            <div className="p-5">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bgSecondary }}>
                    <FileText className="w-8 h-8" style={{ color: theme.textSecondary }} />
                  </div>
                  <h3 className="text-lg font-medium mb-1" style={{ color: theme.textPrimary }}>No posts yet</h3>
                  <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Create your first blog post to get started</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    style={{ background: 'linear-gradient(to right, #10b981, #14b8a6)' }}
                    className="px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-all"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 max-h-[500px] overflow-y-auto">
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePreviewSelect(post)}
                        className="group relative flex gap-4 p-4 rounded-lg transition-all cursor-pointer"
                        style={{
                          backgroundColor: selectedPreviewId === post.id ? 'rgba(16, 185, 129, 0.1)' : theme.bgSecondary,
                          border: `1px solid ${selectedPreviewId === post.id ? theme.accent : theme.border}`
                        }}
                      >
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.bgTertiary }}>
                              <Image className="w-8 h-8" style={{ color: theme.textSecondary }} />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
                              {post.title}
                            </h3>
                            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: theme.accent }}>
                              {post.category}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2 mb-2"
                             style={{ color: theme.textSecondary }}
                             dangerouslySetInnerHTML={{ __html: post.content.slice(0, 150) + '...' }}
                          />
                          <div className="flex items-center gap-4 text-xs" style={{ color: theme.textSecondary }}>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(post.created_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Preview indicator */}
                        {selectedPreviewId === post.id && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-white text-xs font-medium rounded-full" style={{ backgroundColor: theme.accent }}>
                            <Eye size={12} />
                            Preview
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditClick(post); }}
                            className="p-2 rounded-lg transition-all"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: theme.accent }}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                            className="p-2 rounded-lg transition-all"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogContentManager;
