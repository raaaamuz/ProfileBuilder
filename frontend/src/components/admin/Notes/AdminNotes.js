import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Pin, Eye, EyeOff, GripVertical, Save, X, StickyNote } from 'lucide-react';
import api from '../../../services/api';

const SECTION_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'home', label: 'Home' },
  { value: 'career', label: 'Career' },
  { value: 'education', label: 'Education' },
  { value: 'skills', label: 'Skills' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'blog', label: 'Blog' },
];

const HIGHLIGHT_COLORS = [
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' },
  { value: 'green', label: 'Green', bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-800' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800' },
];

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    section: 'general',
    highlight_color: 'yellow',
    is_pinned: false,
    is_visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profiles/notes/', {
        headers: { Authorization: `Token ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (editingNote) {
        await api.put(`/profiles/notes/${editingNote.id}/`, formData, {
          headers: { Authorization: `Token ${token}` }
        });
        setMessage('Note updated successfully');
      } else {
        await api.post('/profiles/notes/', formData, {
          headers: { Authorization: `Token ${token}` }
        });
        setMessage('Note created successfully');
      }
      fetchNotes();
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
      setMessage('Error saving note');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      section: note.section,
      highlight_color: note.highlight_color,
      is_pinned: note.is_pinned,
      is_visible: note.is_visible,
    });
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/profiles/notes/${noteId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setMessage('Note deleted');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const toggleVisibility = async (note) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/profiles/notes/${note.id}/`, {
        is_visible: !note.is_visible
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const togglePin = async (note) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/profiles/notes/${note.id}/`, {
        is_pinned: !note.is_pinned
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      section: 'general',
      highlight_color: 'yellow',
      is_pinned: false,
      is_visible: true,
    });
  };

  const getColorConfig = (colorValue) => {
    return HIGHLIGHT_COLORS.find(c => c.value === colorValue) || HIGHLIGHT_COLORS[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <StickyNote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-500 text-sm">Add highlighted notes for visitors to see</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Note
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Note title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                    placeholder="Write your note..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {SECTION_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Color</label>
                    <div className="flex gap-2 mt-1">
                      {HIGHLIGHT_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, highlight_color: color.value })}
                          className={`w-8 h-8 rounded-full ${color.bg} ${color.border} border-2 ${formData.highlight_color === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Pin to top</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Visible to visitors</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <StickyNote className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No notes yet. Add your first note to highlight important information for visitors.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const colorConfig = getColorConfig(note.highlight_color);
            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl border-l-4 ${colorConfig.bg} ${colorConfig.border} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {note.is_pinned && (
                        <Pin className="w-4 h-4 text-amber-600" />
                      )}
                      <h3 className={`font-semibold ${colorConfig.text}`}>{note.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-white/50 rounded-full text-gray-600 capitalize">
                        {note.section}
                      </span>
                      {!note.is_visible && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(note)}
                      className={`p-2 rounded-lg hover:bg-white/50 ${note.is_pinned ? 'text-amber-600' : 'text-gray-400'}`}
                      title={note.is_pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleVisibility(note)}
                      className={`p-2 rounded-lg hover:bg-white/50 ${note.is_visible ? 'text-green-600' : 'text-gray-400'}`}
                      title={note.is_visible ? 'Hide from visitors' : 'Show to visitors'}
                    >
                      {note.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 rounded-lg hover:bg-white/50 text-blue-600"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 rounded-lg hover:bg-white/50 text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminNotes;
