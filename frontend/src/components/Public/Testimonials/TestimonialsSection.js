import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Star, Quote, User, ExternalLink } from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../../admin/PreviewContext';
import { getSubdomainUsername } from '../../../utils/subdomain';

const TestimonialsSection = ({ isAdminPreview = false, accentColor = '#6366f1' }) => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  const username = urlUsername || subdomainUser;

  const previewContext = useContext(PreviewContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdminPreview && previewContext?.liveTestimonialsData?.length > 0) {
      setTestimonials(previewContext.liveTestimonialsData.filter(t => t.is_active));
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        let res;
        if (isAdminPreview) {
          res = await api.get('/testimonials/');
        } else if (username) {
          res = await api.get(`/testimonials/public/${username}/`);
        } else {
          setLoading(false);
          return;
        }
        setTestimonials(res.data.filter(t => t.is_active));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [isAdminPreview, username, previewContext?.liveTestimonialsData]);

  // Subscribe to live updates
  useEffect(() => {
    if (isAdminPreview && previewContext?.liveTestimonialsData) {
      setTestimonials(previewContext.liveTestimonialsData.filter(t => t.is_active));
    }
  }, [isAdminPreview, previewContext?.liveTestimonialsData]);

  const renderStars = (rating) => (
    <div style={{ display: 'flex', gap: '0.125rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={isAdminPreview ? 12 : 16}
          style={{
            color: star <= rating ? '#fbbf24' : '#334155',
            fill: star <= rating ? '#fbbf24' : 'none',
          }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div style={{
          width: '3rem', height: '3rem',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: accentColor,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  const featuredTestimonials = testimonials.filter(t => t.is_featured);
  const regularTestimonials = testimonials.filter(t => !t.is_featured);

  return (
    <section style={{
      padding: isAdminPreview ? '2rem 1rem' : '4rem 2rem',
      backgroundColor: '#0f172a',
      minHeight: isAdminPreview ? 'auto' : '100vh',
      width: '100%',
    }}>
      <div style={{ maxWidth: isAdminPreview ? 'none' : '72rem', margin: isAdminPreview ? '0' : '0 auto', width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{
            fontSize: isAdminPreview ? '1.5rem' : '2.5rem',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '0.75rem',
          }}>
            What Clients Say
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: isAdminPreview ? '0.875rem' : '1.125rem',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Testimonials from people I've worked with
          </p>
        </motion.div>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: featuredTestimonials.length === 1 ? '1fr' : `repeat(auto-fit, minmax(${isAdminPreview ? '280px' : '400px'}, 1fr))`,
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '1rem',
                  padding: isAdminPreview ? '1.5rem' : '2rem',
                  border: `2px solid ${accentColor}`,
                  position: 'relative',
                }}
              >
                {/* Quote Icon */}
                <Quote
                  size={isAdminPreview ? 32 : 48}
                  style={{
                    position: 'absolute',
                    top: isAdminPreview ? '1rem' : '1.5rem',
                    right: isAdminPreview ? '1rem' : '1.5rem',
                    color: `${accentColor}30`,
                  }}
                />

                {/* Featured Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: `${accentColor}20`,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  marginBottom: '1rem',
                }}>
                  <Star size={12} style={{ color: accentColor, fill: accentColor }} />
                  <span style={{ fontSize: '0.75rem', color: accentColor, fontWeight: '600' }}>Featured</span>
                </div>

                {/* Content */}
                <p style={{
                  color: '#e2e8f0',
                  fontSize: isAdminPreview ? '0.9375rem' : '1.125rem',
                  lineHeight: '1.7',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                }}>
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div style={{ marginBottom: '1rem' }}>
                  {renderStars(testimonial.rating)}
                </div>

                {/* Client Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: isAdminPreview ? '3rem' : '3.5rem',
                    height: isAdminPreview ? '3rem' : '3.5rem',
                    borderRadius: '50%',
                    backgroundColor: '#334155',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {testimonial.client_photo ? (
                      <img
                        src={testimonial.client_photo}
                        alt={testimonial.client_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={isAdminPreview ? 20 : 24} style={{ color: '#64748b' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{
                        color: '#f8fafc',
                        fontWeight: '600',
                        fontSize: isAdminPreview ? '0.9375rem' : '1rem',
                        margin: 0,
                      }}>
                        {testimonial.client_name}
                      </h4>
                      {testimonial.linkedin_url && (
                        <a
                          href={testimonial.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#64748b' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    {(testimonial.client_title || testimonial.client_company) && (
                      <p style={{
                        color: '#94a3b8',
                        fontSize: isAdminPreview ? '0.8125rem' : '0.875rem',
                        margin: 0,
                      }}>
                        {[testimonial.client_title, testimonial.client_company].filter(Boolean).join(' at ')}
                      </p>
                    )}
                    {testimonial.project_name && (
                      <p style={{
                        color: accentColor,
                        fontSize: isAdminPreview ? '0.75rem' : '0.8125rem',
                        margin: '0.25rem 0 0',
                      }}>
                        Project: {testimonial.project_name}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Regular Testimonials */}
        {regularTestimonials.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${isAdminPreview ? '240px' : '300px'}, 1fr))`,
            gap: '1rem',
          }}>
            {regularTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (featuredTestimonials.length + index) * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '0.75rem',
                  padding: isAdminPreview ? '1.25rem' : '1.5rem',
                  border: '1px solid #334155',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Content */}
                <p style={{
                  color: '#cbd5e1',
                  fontSize: isAdminPreview ? '0.875rem' : '0.9375rem',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div style={{ marginBottom: '0.75rem' }}>
                  {renderStars(testimonial.rating)}
                </div>

                {/* Client Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: isAdminPreview ? '2.5rem' : '2.75rem',
                    height: isAdminPreview ? '2.5rem' : '2.75rem',
                    borderRadius: '50%',
                    backgroundColor: '#334155',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {testimonial.client_photo ? (
                      <img
                        src={testimonial.client_photo}
                        alt={testimonial.client_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={isAdminPreview ? 16 : 18} style={{ color: '#64748b' }} />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{
                      color: '#f8fafc',
                      fontWeight: '600',
                      fontSize: isAdminPreview ? '0.875rem' : '0.9375rem',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {testimonial.client_name}
                    </h4>
                    {(testimonial.client_title || testimonial.client_company) && (
                      <p style={{
                        color: '#94a3b8',
                        fontSize: isAdminPreview ? '0.75rem' : '0.8125rem',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {[testimonial.client_title, testimonial.client_company].filter(Boolean).join(' at ')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
