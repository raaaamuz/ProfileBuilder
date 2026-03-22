import React, { useState, useEffect } from "react";
import Navbar from "../NavBar";
import api from "../../../services/api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blog/posts/");
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Error fetching blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row"
          >
            <div className="p-8 md:w-1/2">
              <p className="text-gray-400 text-sm">
                {blog.date} • {blog.readTime}
              </p>
              <h2 className="text-3xl font-bold mt-2">{blog.title}</h2>
              {expandedBlogId === blog.id ? (
                <div
                  className="mt-3 text-gray-300"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.content}
                </div>
              ) : (
                <div
                  className="mt-3 text-gray-300"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.content.slice(0, 200)}...
                </div>
              )}
              <button
                onClick={() =>
                  setExpandedBlogId(expandedBlogId === blog.id ? null : blog.id)
                }
                className="mt-4 text-red-400 hover:text-red-500 transition-all"
              >
                {expandedBlogId === blog.id ? "Show Less" : "Read More"}
              </button>
              <div className="mt-6 flex items-center justify-between text-gray-500 text-sm border-t border-gray-700 pt-4">
                <span>{blog.views} views</span>
                <span>{blog.comments} comments</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
