import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Edit2, Trash2, GripVertical, Save, X, Star, Package,
  DollarSign, Clock, MessageSquare, Code, Palette, Camera,
  FileText, Megaphone, Settings, Zap, Globe, Shield, ChevronDown, ChevronUp, Eye
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

const ICON_OPTIONS = [
  { name: 'Code', icon: Code, label: 'Development' },
  { name: 'Palette', icon: Palette, label: 'Design' },
  { name: 'Camera', icon: Camera, label: 'Photography' },
  { name: 'FileText', icon: FileText, label: 'Writing' },
  { name: 'Megaphone', icon: Megaphone, label: 'Marketing' },
  { name: 'Settings', icon: Settings, label: 'Consulting' },
  { name: 'Zap', icon: Zap, label: 'Performance' },
  { name: 'Globe', icon: Globe, label: 'Web' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Package', icon: Package, label: 'Product' },
];

const PRICE_TYPES = [
  { value: 'hourly', label: 'Per Hour', prefix: '', suffix: '/hr' },
  { value: 'fixed', label: 'Fixed Price', prefix: '', suffix: '' },
  { value: 'starting', label: 'Starting At', prefix: 'From ', suffix: '' },
  { value: 'contact', label: 'Contact for Quote', prefix: '', suffix: '' },
];

const AdminServices = () => {
  const { updateLiveServices } = useContext(PreviewContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const emptyService = {
    title: '',
    description: '',
    short_description: '',
    icon: 'Code',
    price: '',
    price_type: 'hourly',
    is_featured: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(emptyService);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/');
      setServices(res.data);
      updateLiveServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService) {
        const res = await api.put(`/services/${editingService.id}/`, formData);
        setServices(services.map(s => s.id === editingService.id ? res.data : s));
      } else {
        const res = await api.post('/services/', { ...formData, order: services.length });
        setServices([...services, res.data]);
      }
      updateLiveServices(editingService
        ? services.map(s => s.id === editingService.id ? formData : s)
        : [...services, formData]
      );
      resetForm();
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}/`);
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      updateLiveServices(updated);
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleReorder = async (newOrder) => {
    setServices(newOrder);
    updateLiveServices(newOrder);
    // Update order in backend
    try {
      await Promise.all(newOrder.map((service, index) =>
        api.put(`/services/${service.id}/`, { ...service, order: index })
      ));
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  const resetForm = () => {
    setFormData(emptyService);
    setEditingService(null);
    setIsCreating(false);
  };

  const startEdit = (service) => {
    setFormData(service);
    setEditingService(service);
    setIsCreating(true);
  };

  const getIconComponent = (iconName) => {
    const found = ICON_OPTIONS.find(i => i.name === iconName);
    return found ? found.icon : Code;
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
            <Package style={{ width: '1.5rem', height: '1.5rem', color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Services</h1>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Showcase what you offer</p>
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
            <Plus size={20} /> Add Service
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
                  {editingService ? 'Edit Service' : 'New Service'}
                </h2>
                <button type="button" onClick={resetForm} style={{
                  background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer',
                }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Service Title *
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Web Development"
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Icon */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Icon
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: name })}
                        style={{
                          padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
                          backgroundColor: formData.icon === name ? theme.accent : theme.bgTertiary,
                          border: `1px solid ${formData.icon === name ? theme.accent : theme.border}`,
                          color: formData.icon === name ? '#fff' : theme.textSecondary,
                        }}
                        title={name}
                      >
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Short Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Short Description (for cards)
                  </label>
                  <input
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief one-liner about this service"
                    maxLength={300}
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  />
                </div>

                {/* Full Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of what this service includes..."
                    rows={3}
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem', resize: 'vertical',
                    }}
                  />
                </div>

                {/* Price Type */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Pricing Type
                  </label>
                  <select
                    value={formData.price_type}
                    onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem', backgroundColor: theme.bgTertiary,
                      border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                      color: theme.textPrimary, fontSize: '0.875rem',
                    }}
                  >
                    {PRICE_TYPES.map(pt => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Price {formData.price_type !== 'contact' && '*'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                    <input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder={formData.price_type === 'contact' ? 'Optional' : 'e.g., 50'}
                      disabled={formData.price_type === 'contact'}
                      style={{
                        width: '100%', padding: '0.75rem', paddingLeft: '2.5rem',
                        backgroundColor: theme.bgTertiary,
                        border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                        color: theme.textPrimary, fontSize: '0.875rem',
                        opacity: formData.price_type === 'contact' ? 0.5 : 1,
                      }}
                    />
                  </div>
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
                    <span style={{ color: theme.textPrimary, fontSize: '0.875rem' }}>Featured Service</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '1rem', height: '1rem', accentColor: theme.accent }}
                    />
                    <span style={{ color: theme.textPrimary, fontSize: '0.875rem' }}>Active (visible on profile)</span>
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
                  {saving ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services List */}
      {services.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          backgroundColor: theme.bgSecondary, borderRadius: '1rem',
          border: `1px dashed ${theme.border}`,
        }}>
          <Package size={48} style={{ color: theme.textTertiary, marginBottom: '1rem' }} />
          <p style={{ color: theme.textSecondary, margin: 0 }}>No services yet. Add your first service!</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={services} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            const priceType = PRICE_TYPES.find(pt => pt.value === service.price_type);
            const isExpanded = expandedId === service.id;
            return (
              <Reorder.Item key={service.id} value={service} style={{ marginBottom: '0.75rem' }}>
                <motion.div
                  layout
                  style={{
                    backgroundColor: theme.bgSecondary, borderRadius: '0.75rem',
                    border: `1px solid ${isExpanded ? theme.accent : theme.border}`,
                    opacity: service.is_active ? 1 : 0.6,
                    overflow: 'hidden',
                  }}
                >
                  {/* Main Row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem',
                  }}>
                    <GripVertical size={20} style={{ color: theme.textTertiary, cursor: 'grab' }} />

                    <div style={{
                      padding: '0.75rem', backgroundColor: `${theme.accent}20`,
                      borderRadius: '0.75rem',
                    }}>
                      <IconComponent size={24} style={{ color: theme.accent }} />
                    </div>

                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : service.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ color: theme.textPrimary, margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                          {service.title}
                        </h3>
                        {service.is_featured && (
                          <Star size={14} style={{ color: theme.warning, fill: theme.warning }} />
                        )}
                        {!service.is_active && (
                          <span style={{ fontSize: '0.75rem', color: theme.textTertiary, padding: '0.125rem 0.5rem', backgroundColor: theme.bgTertiary, borderRadius: '0.25rem' }}>
                            Hidden
                          </span>
                        )}
                      </div>
                      <p style={{ color: theme.textSecondary, margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                        {service.short_description || (service.description ? service.description.substring(0, 80) + '...' : 'Click to add description')}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      {service.price_type === 'contact' ? (
                        <span style={{ color: theme.accent, fontSize: '0.875rem', fontWeight: '500' }}>Contact</span>
                      ) : service.price ? (
                        <span style={{ color: theme.success, fontSize: '1rem', fontWeight: '600' }}>
                          {priceType?.prefix}${service.price}{priceType?.suffix}
                        </span>
                      ) : (
                        <span style={{ color: theme.textTertiary, fontSize: '0.875rem' }}>No price set</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : service.id)}
                        style={{
                          padding: '0.5rem', backgroundColor: 'transparent',
                          border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                          color: theme.textSecondary, cursor: 'pointer',
                        }}
                        title="View details"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => startEdit(service)}
                        style={{
                          padding: '0.5rem', backgroundColor: 'transparent',
                          border: `1px solid ${theme.border}`, borderRadius: '0.5rem',
                          color: theme.textSecondary, cursor: 'pointer',
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        style={{
                          padding: '0.5rem', backgroundColor: 'transparent',
                          border: `1px solid ${theme.error}40`, borderRadius: '0.5rem',
                          color: theme.error, cursor: 'pointer',
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '1rem 1.25rem',
                          borderTop: `1px solid ${theme.border}`,
                          backgroundColor: theme.bgTertiary + '40',
                        }}>
                          {/* Full Description */}
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Full Description
                            </label>
                            <p style={{ color: theme.textPrimary, margin: 0, fontSize: '0.9375rem', lineHeight: '1.6' }}>
                              {service.description || <span style={{ color: theme.textTertiary, fontStyle: 'italic' }}>No detailed description added. Click Edit to add one.</span>}
                            </p>
                          </div>

                          {/* Details Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Pricing Type
                              </label>
                              <p style={{ color: theme.textPrimary, margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                                {priceType?.label || service.price_type}
                              </p>
                            </div>
                            <div>
                              <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Price
                              </label>
                              <p style={{ color: theme.success, margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>
                                {service.price_type === 'contact' ? 'Contact for Quote' : service.price ? `${priceType?.prefix}$${service.price}${priceType?.suffix}` : 'Not set'}
                              </p>
                            </div>
                            <div>
                              <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Status
                              </label>
                              <p style={{ color: service.is_active ? theme.success : theme.warning, margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                                {service.is_active ? 'Active' : 'Hidden'}
                              </p>
                            </div>
                            <div>
                              <label style={{ display: 'block', color: theme.textSecondary, fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Featured
                              </label>
                              <p style={{ color: service.is_featured ? theme.warning : theme.textSecondary, margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                                {service.is_featured ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>

                          {/* Quick Edit Button */}
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}` }}>
                            <button
                              onClick={() => startEdit(service)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', backgroundColor: theme.accent,
                                border: 'none', borderRadius: '0.5rem',
                                color: '#fff', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer',
                              }}
                            >
                              <Edit2 size={14} /> Edit Service Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
};

export default AdminServices;
