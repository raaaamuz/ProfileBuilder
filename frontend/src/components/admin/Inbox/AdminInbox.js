import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, Clock, User, X, CheckCheck } from 'lucide-react';
import api from '../../../services/api';

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact/inbox/');
      setMessages(response.data.messages);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Open message and mark as read
  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await api.get(`/contact/message/${message.id}/`);
        setMessages(prev =>
          prev.map(m => m.id === message.id ? { ...m, is_read: true } : m)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  // Delete message
  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contact/message/${id}/`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await api.post('/contact/mark-all-read/');
      setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Mail className="text-purple-600" size={32} />
            Inbox
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Message List */}
        <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-xl shadow-lg overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail size={48} className="mx-auto mb-4 opacity-30" />
              <p>No messages yet</p>
              <p className="text-sm mt-2">Messages from your contact form will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleOpenMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedMessage?.id === message.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                  } ${!message.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${!message.is_read ? 'text-blue-600' : 'text-gray-400'}`}>
                        {message.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold truncate ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.sender_name}
                          </span>
                          {!message.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className={`text-sm truncate ${!message.is_read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                          {message.subject || 'No Subject'}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {message.message.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(message.created_at)}
                      </span>
                      <button
                        onClick={(e) => handleDeleteMessage(message.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="hidden md:block flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedMessage.subject || 'No Subject'}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-purple-100">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {selectedMessage.sender_name}
                        </span>
                        <span>{selectedMessage.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 hover:bg-white/20 rounded-lg transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-sm text-purple-200">
                    <Clock size={14} />
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Mail size={18} />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center text-gray-400"
              >
                <div className="text-center">
                  <MailOpen size={64} className="mx-auto mb-4 opacity-30" />
                  <p>Select a message to read</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;
