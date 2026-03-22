import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { PreviewContext } from "../../admin/PreviewContext";
import { getSubdomainUsername } from "../../../utils/subdomain";

// Helper to strip HTML tags for the excerpt
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const BlogList = ({ isAdminPreview = false }) => {
  const { liveBlogData, liveBlogList } = useContext(PreviewContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(!isAdminPreview); // Don't show loading for admin preview
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();

  // Check if user is authenticated based on token existence
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // For public view, use the username from URL, subdomain, or default to "guest"
  const username = urlUsername || subdomainUsername || "guest";

  // Fetch blogs for public view (not admin preview)
  useEffect(() => {
    // Skip fetching for admin preview
    if (isAdminPreview) {
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      try {
        let response;
        if (isAuthenticated) {
          response = await api.get("/blog/posts/");
          const data = response.data;
          setBlogs(Array.isArray(data) ? data : data.results || []);
        } else {
          response = await api.get(`/public/profile/${username}/`);
          setBlogs(response.data.blog_posts || []);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (err.response?.status === 404 || err.response?.status === 204) {
          setBlogs([]);
        } else {
          setError("Error fetching blogs. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [isAdminPreview, isAuthenticated, token, username]);

  // Admin preview - show selected blog
  if (isAdminPreview) {
    // No data and no blog list
    if (!liveBlogData && (!liveBlogList || liveBlogList.length === 0)) {
      return (
        <div>
          <div className="max-w-5xl mx-auto p-6 text-center">
            <div className="py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-500">Create your first blog post to see it here.</p>
            </div>
          </div>
        </div>
      );
    }

    // Show selected blog
    if (liveBlogData) {
      return (
        <div>
          <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
              {/* Left Column - Blog Content Preview */}
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <p className="text-gray-400 text-sm">
                  {liveBlogData.date || new Date().toLocaleDateString()} • {liveBlogData.readTime || '5 min read'}
                </p>
                <h2 className="text-3xl font-bold mt-2">{liveBlogData.title}</h2>
                <div className="mt-3 text-gray-300">
                  {stripHtml(liveBlogData.content || '').slice(0, 200)}...
                </div>
                <button className="mt-4 text-red-400 hover:text-red-500 transition-all text-left">
                  Read More
                </button>

                <div className="mt-6 flex items-center justify-between text-gray-500 text-sm border-t border-gray-700 pt-4">
                  <span>{liveBlogData.views || 0} views</span>
                  <span>
                    {Array.isArray(liveBlogData.comments) ? liveBlogData.comments.length : 0} comments
                  </span>
                </div>
              </div>
              {/* Right Column - Blog Image */}
              <div className="md:w-1/3 flex justify-center items-center bg-gray-800">
                {liveBlogData.image ? (
                  <img
                    src={liveBlogData.image}
                    alt={liveBlogData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="max-w-5xl mx-auto p-6">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Blogs</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter blogs by category
  const filteredBlogs = (blogs || []).filter(
    (blog) => blog.category === "Blogs" || blog.category === "Blog"
  );

  // Show all blogs if no category filter matches
  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : blogs;

  // Empty state
  if (!displayBlogs || displayBlogs.length === 0) {
    return (
      <div>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-500">Create your first blog post to see it here.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main blog list
  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {displayBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row"
          >
            {/* Left Column - Blog Content Preview */}
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <p className="text-gray-400 text-sm">
                {blog.date} • {blog.readTime}
              </p>
              <h2 className="text-3xl font-bold mt-2">{blog.title}</h2>
              <div className="mt-3 text-gray-300">
                {stripHtml(blog.content).slice(0, 200)}...
              </div>
              <button
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="mt-4 text-red-400 hover:text-red-500 transition-all text-left"
              >
                Read More
              </button>

              <div className="mt-6 flex items-center justify-between text-gray-500 text-sm border-t border-gray-700 pt-4">
                <span>{blog.views} views</span>
                <span>
                  {Array.isArray(blog.comments) ? blog.comments.length : 0} comments
                </span>
              </div>
            </div>
            {/* Right Column - Blog Image */}
            <div className="md:w-1/3 flex justify-center items-center">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
