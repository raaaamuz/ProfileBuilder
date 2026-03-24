import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Edit2, Trash2, GripVertical, Save, X, Star, Quote,
  User, Building, Calendar, Linkedin, Briefcase, Upload, Image
} from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../PreviewContext';

const theme = {
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  border: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  accent: '#6366f1',
  accentHover: '#4f46e5',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

const AdminTestimonials = () => {
  const { updateLiveTestimonials } = useContext(PreviewContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const emptyTestimonial = {
    client_name: '',
    client_title: '',
    client_company: '',
    content: '',
    rating: 5,
    project_name: '',
    date: '',
    linkedin_url: '',
    is_featured: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(emptyTestimonial);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials/');
      setTestimonials(res.data);
      updateLiveTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });
    if (photoFile) {
      data.append('client_photo', photoFile);
    }

    try {
      let res;
      if (editingTestimonial) {
        res = await api.put(`/testimonials/${editingTestimonial.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? res.data : t));
      } else {
        data.append('order', testimonials.length);
        res = await api.post('/testimonials/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTestimonials([...testimonials, res.data]);
      }
      updateLiveTestimonials(editingTestimonial
        ? testimonials.map(t => t.id === editingTestimonial.id ? res.data : t)
        : [...testimonials, res.data]
      );
      resetForm();
    } catch (err) {
      console.error('Error saving testimonial:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}/`);
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      updateLiveTestimonials(updated);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const handleReorder = async (newOrder) => {
    setTestimonials(newOrder);
    updateLiveTestimonials(newOrder);
    try {
      await Promise.all(newOrder.map((testimonial, index) =>
        api.put(`/testimonials/${testimonial.id}/`, { ...testimonial, order: index })
      ));
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData(emptyTestimonial);
    setEditingTestimonial(null);
    setIsCreating(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const startEdit = (testimonial) => {
    setFormData({
      client_name: testimonial.client_name || '',
      client_title: testimonial.client_title || '',
      client_company: testimonial.client_company || '',
      content: testimonial.content || '',
      rating: testimonial.rating || 5,
      project_name: testimonial.project_name || '',
      date: testimonial.date || '',
      linkedin_url: testimonial.linkedin_url || '',
      is_featured: testimonial.is_featured || false,
      is_active: testimonial.is_active !== false,
    });
    setPhotoPreview(testimonial.client_photo || null);
    setEditingTestimonial(testimonial);
    setIsCreating(true);
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={interactive ? 20 : 14}
            style={{
              color: star <= rating ? theme.warning : theme.bgTertiary,
              fill: star <= rating ? theme.warning : 'none',
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={interactive ? () => setFormData({ ...formData, rating: star }) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ width: '3rem', height: '3rem', border: `4px solid ${theme.bgTertiary}`, borderTopColor: theme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: theme.accent, borderRadius: '1rem' }}>
            <Quote style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Testimonials</h1>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Client reviews and recommendations</p>
          </div>
        </div>
        {!isCreating && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreating(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', backgroundColor: theme.accent,
              color: '#fff', border: 'none', borderRadius: '0.75rem',
              fontWeight: '600', cursor: 'pointer',
            }}
          >
            <Plus size={20} /> Add Testimonial
          </motion.button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '2rem' }}
          >
            <form onSubmit={handleSubmit} style={{
              backgroundColor: theme.bgSecondary, borderRadius: '1rem',
              padding: '1.5rem', border: `1px solid ${theme.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: theme.textPrimary, margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                  {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                </h2>
                <button type="button" onClick={resetForm} style={{
                  background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer',
                }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Client Photo */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: theme.bgTertiary, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px dashed ${theme.border}`,
                  }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={32} style={{ color: theme.textTertiary }} />
                    )}
                  </div>
                  <div>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textSecondary, cursor: 'pointer', fontSize: '0.875rem',
                    }}>
                      <Upload size={16} />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                    </label>
                    <p style={{ color: theme.textTertiary, fontSize: '0.75rem', margin: '0.25rem 0 0' }}>Optional</p>
                  </div>
                </div>

                {/* Client Name */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <User size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Client Name *
                  </label>
                  <input
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="John Doe"
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Client Title */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Briefcase size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Client Title
                  </label>
                  <input
                    value={formData.client_title}
                    onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                    placeholder="CEO, Product Manager, etc."
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Client Company */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Building size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Company
                  </label>
                  <input
                    value={formData.client_company}
                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                    placeholder="TechCorp Inc."
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Project/Service
                  </label>
                  <input
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="Website Redesign"
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Testimonial Content */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Quote size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Testimonial *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What did the client say about working with you?"
                    rows={4}
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem', resize: 'vertical',
                    }}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Rating
                  </label>
                  {renderStars(formData.rating, true)}
                </div>

                {/* Date */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* LinkedIn URL */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Linkedin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    LinkedIn Profile (for verification)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/johndoe"
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Toggles */}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{ width: '1rem', height: '1rem', accentColor: theme.accent }}
                    />
                    <Star size={16} style={{ color: theme.warning }} />
                    <span style={{ color: theme.textPrimary, fontSize: '0.875rem' }}>Featured</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '1rem', height: '1rem', accentColor: theme.accent }}
                    />
                    <span style={{ color: theme.textPrimary, fontSize: '0.875rem' }}>Active</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.75rem 1.5rem', backgroundColor: 'transparent',
                    border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                    color: theme.textSecondary, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem', backgroundColor: theme.success,
                    border: 'none', borderRadius: '0.5rem',
                    color: '#fff', fontWeight: '600', cursor: 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : (editingTestimonial ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          backgroundColor: theme.bgSecondary, borderRadius: '1rem',
          border: `1px dashed ${theme.border}`,
        }}>
          <Quote size={48} style={{ color: theme.textTertiary, marginBottom: '1rem' }} />
          <p style={{ color: theme.textSecondary, margin: 0 }}>No testimonials yet. Add your first one!</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={testimonials} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {testimonials.map((testimonial) => (
            <Reorder.Item key={testimonial.id} value={testimonial} style={{ marginBottom: '0.75rem' }}>
              <motion.div
                layout
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  backgroundColor: theme.bgSecondary, borderRadius: '0.75rem',
                  padding: '1.25rem', border: `1px solid ${theme.border}`,
                  opacity: testimonial.is_active ? 1 : 0.6,
                }}
              >
                <GripVertical size={20} style={{ color: theme.textTertiary, cursor: 'grab', marginTop: '0.25rem' }} />

                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: theme.bgTertiary, overflow: 'hidden',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {testimonial.client_photo ? (
                    <img src={testimonial.client_photo} alt={testimonial.client_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={24} style={{ color: theme.textTertiary }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ color: theme.textPrimary, margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                      {testimonial.client_name}
                    </h3>
                    {testimonial.is_featured && (
                      <Star size={14} style={{ color: theme.warning, fill: theme.warning }} />
                    )}
                    {!testimonial.is_active && (
                      <span style={{ fontSize: '0.75rem', color: theme.textTertiary, padding: '0.125rem 0.5rem', backgroundColor: theme.bgTertiary, borderRadius: '0.25rem' }}>
                        Hidden
                      </span>
                    )}
                  </div>
                  {(testimonial.client_title || testimonial.client_company) && (
                    <p style={{ color: theme.textSecondary, margin: '0.125rem 0 0', fontSize: '0.8125rem' }}>
                      {[testimonial.client_title, testimonial.client_company].filter(Boolean).join(' at ')}
                    </p>
                  )}
                  <div style={{ margin: '0.5rem 0' }}>
                    {renderStars(testimonial.rating)}
                  </div>
                  <p style={{
                    color: theme.textSecondary, margin: '0.5rem 0 0', fontSize: '0.875rem',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    "{testimonial.content}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => startEdit(testimonial)}
                    style={{
                      padding: '0.5rem', backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textSecondary, cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    style={{
                      padding: '0.5rem', backgroundColor: 'transparent',
                      border: `1px solid ${theme.error}40`, borderRadius: '0.5rem',
                      color: theme.error, cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default AdminTestimonials;
