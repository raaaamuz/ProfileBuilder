import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../../services/api";

const BlogContentManager = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  // Use ReactQuill for rich text formatting (this will be HTML)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  // Fetch posts from backend on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blog/posts/");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle image selection and preview generation
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fill form with the selected post data for editing
  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content); // post.content should contain HTML from ReactQuill
    setImagePreview(post.image || null);
    setImage(null);
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
    }
    
    try {
      if (editingPostId) {
        const response = await api.put(`/blog/posts/${editingPostId}/`, formData);
        const updatedPost = response.data;
        setPosts(posts.map((post) => (post.id === editingPostId ? updatedPost : post)));
        setEditingPostId(null);
      } else {
        const response = await api.post("/blog/posts/", formData);
        const savedPost = response.data;
        setPosts([savedPost, ...posts]);
      }
      // Reset form fields
      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);
      setImagePreview(null);
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
    setImagePreview(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="header bg-white h-16 px-10 py-8 border-b-2 border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-400">
          <span className="text-green-700 tracking-wider font-thin text-md">
            <a href="/admin/blogs">Home</a>
          </span>
          <span>/</span>
          <span className="tracking-wide text-md">
            <span className="text-base">Blog</span>
          </span>
          <span>/</span>
        </div>
      </div>
      <div className="header my-3 h-12 px-10 flex items-center justify-between">
        <h1 className="font-medium text-2xl">All Blog Posts</h1>
      </div>

      {/* Main content */}
      <div className="flex flex-col mx-3 mt-6 lg:flex-row">
        {/* Left: Blog Post Form */}
        <div className="w-full lg:w-1/3 m-1">
          <form onSubmit={handleSubmit} className="w-full bg-white shadow-md p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              {/* Title Input */}
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              {/* Category Input */}
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]"
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Blog Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              {/* Content Rich Text Editor */}
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                  Content
                </label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Blog Content"
                />
              </div>
              {/* Submit Button */}
              <div className="w-full px-3 mb-6">
                <button
                  type="submit"
                  className="appearance-none block w-full bg-green-700 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-green-600 focus:outline-none"
                >
                  {editingPostId ? "Update Blog Post" : "Add Blog Post"}
                </button>
              </div>
              {/* Cancel Edit Button */}
              {editingPostId && (
                <div className="w-full px-3 mb-6">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="appearance-none block w-full bg-red-500 text-white font-bold border border-red-600 rounded-lg py-3 px-3 leading-tight hover:bg-red-600 focus:outline-none"
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
              {/* Image Upload */}
              <div className="w-full px-3 mb-8">
                <label
                  className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center"
                  htmlFor="dropzone-file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
                    Blog Image
                  </h2>
                  <p className="mt-2 text-gray-500 tracking-wide">
                    Upload or drag & drop your file (SVG, PNG, JPG or GIF).
                  </p>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="blog_image"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 h-20 w-20 object-cover mx-auto"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Right: Posts Table */}
        <div className="w-full lg:w-2/3 m-1 bg-white shadow-lg text-lg rounded-sm border border-gray-200">
          <div className="overflow-x-auto rounded-lg p-3">
            <table className="table-auto w-full">
              <thead className="text-sm font-semibold uppercase text-gray-800 bg-gray-50">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th className="p-2">
                    <div className="font-semibold">Title</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold">Category</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-left">Content</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Blog"
                          className="h-8 w-8 mx-auto"
                        />
                      )}
                    </td>
                    <td className="p-2">{post.title}</td>
                    <td className="p-2">{post.category}</td>
                    <td className="p-2" style={{ whiteSpace: "pre-wrap" }}>
                      {post.content.slice(0, 100)}
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center space-x-2">
                        <a
                          href="#"
                          onClick={() => handleEditClick(post)}
                          className="rounded-md hover:bg-green-100 text-green-600 p-2 flex items-center"
                        >
                          <FaEdit className="w-4 h-4 mr-1" /> Edit
                        </a>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded-md hover:bg-red-100 text-red-600 p-2 flex items-center"
                        >
                          <FaTrash className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      No blog posts added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContentManager;
