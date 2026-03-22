import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../NavBar";
import api from "../../../services/api";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we're replying to

  // Fetch current blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blog/posts/${id}/`);
        setBlog(response.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Error fetching blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch all blogs for the list at the bottom
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await api.get("/blog/posts/");
        setAllBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs list:", err);
      }
    };

    fetchAllBlogs();
  }, []);

  // Fetch comments for the current blog post.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Adjust the URL as needed.
        const response = await api.get(`/blog/comments/?blog_post=${id}`);
        setComments(response.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // Handle comment submission (guest or logged in)
  const handleCommentSubmit = async (e, parentId = null) => {
    e.preventDefault();
    setCommentError(null);
    setCommentSubmitting(true);

    // Build comment payload.
    const payload = {
      blog_post: id,
      content: commentContent,
      parent: parentId, // Include parent for replies
    };

    // For guest comments, include guest_name and guest_email.
    if (guestName || guestEmail) {
      payload.guest_name = guestName;
      payload.guest_email = guestEmail;
    }

    try {
      const response = await api.post("/blog/comments/", payload);

      if (parentId) {
        // If it's a reply, add it to the parent comment's replies
        setComments(comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data]
            };
          }
          return comment;
        }));
        setReplyingTo(null); // Close reply form
      } else {
        // On success, add to top of comments list and clear form.
        setComments([response.data, ...comments]);
      }

      setCommentContent("");
      setGuestName("");
      setGuestEmail("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError("Error submitting comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <p>{error || "Blog not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        {/* Blog content */}
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <p className="text-gray-500 mt-2">
          {blog.date} • {blog.readTime}
        </p>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            style={{ width: "auto", height: "auto", maxWidth: "100%" }}
            className="mt-4 mx-auto"
          />
        )}
        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

        {/* Comments Section */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Comments ({comments.filter(c => !c.parent).length})
          </h2>

          {/* Comment List */}
          {comments.filter(c => !c.parent).length > 0 ? (
            <ul className="space-y-4">
              {comments.filter(c => !c.parent).map((comment) => (
                <li key={comment.id} className="border rounded-lg overflow-hidden">
                  {/* Main Comment */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {(comment.commenter || comment.guest_name || "G").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.commenter || comment.guest_name || "Guest"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{comment.content}</p>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      {replyingTo === comment.id ? "Cancel" : "Reply"}
                    </button>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form
                        onSubmit={(e) => handleCommentSubmit(e, comment.id)}
                        className="mt-4 pl-4 border-l-2 border-blue-200"
                      >
                        <p className="text-sm text-gray-600 mb-2">
                          Replying to {comment.commenter || comment.guest_name || "Guest"}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="px-3 py-2 border rounded text-sm"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="px-3 py-2 border rounded text-sm"
                            required
                          />
                        </div>
                        <textarea
                          placeholder="Write your reply..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm mb-2"
                          rows="2"
                          required
                        ></textarea>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          disabled={commentSubmitting}
                        >
                          {commentSubmitting ? "Sending..." : "Post Reply"}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="bg-white border-t">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-4 pl-12 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {(reply.commenter || reply.guest_name || "G").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">
                                {reply.commenter || reply.guest_name || "Guest"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(reply.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700 text-sm pl-11">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 py-8 text-center bg-gray-50 rounded-lg">
              No comments yet. Be the first to comment!
            </p>
          )}

          {/* Main Comment Form */}
          <form onSubmit={(e) => handleCommentSubmit(e, null)} className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Write your comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              ></textarea>
            </div>
            {commentError && (
              <p className="text-red-500 mb-3 text-sm">{commentError}</p>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={commentSubmitting}
            >
              {commentSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>

        {/* Other Blogs in Card Format */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Other Blogs
          </h2>
          <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            {allBlogs
              .filter((b) => b.id !== blog.id)
              .map((b) => (
                <article
                  key={b.id}
                  className="relative w-full h-64 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
                  style={{
                    backgroundImage: `url(${b.image ||
                      "https://via.placeholder.com/600x400"})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
                  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex justify-center items-center">
                    <h3 className="text-center">
                      <Link
                        to={`/blog/${b.id}`}
                        className="text-white text-2xl font-bold text-center"
                      >
                        <span className="absolute inset-0"></span>
                        {b.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
          </section>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
