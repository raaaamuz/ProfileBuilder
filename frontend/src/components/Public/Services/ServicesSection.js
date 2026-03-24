import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  Code, Palette, Camera, FileText, Megaphone, Settings, Zap, Globe, Shield, Package,
  Star, DollarSign, ArrowRight
} from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../../admin/PreviewContext';
import { getSubdomainUsername } from '../../../utils/subdomain';

const ICON_MAP = {
  Code, Palette, Camera, FileText, Megaphone, Settings, Zap, Globe, Shield, Package
};

const PRICE_TYPES = {
  hourly: { prefix: '', suffix: '/hr' },
  fixed: { prefix: '', suffix: '' },
  starting: { prefix: 'From ', suffix: '' },
  contact: { prefix: '', suffix: '' },
};

const ServicesSection = ({ isAdminPreview = false, accentColor = '#6366f1' }) => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  const username = urlUsername || subdomainUser;

  const previewContext = useContext(PreviewContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdminPreview && previewContext?.liveServicesData?.length > 0) {
      setServices(previewContext.liveServicesData.filter(s => s.is_active));
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        let res;
        if (isAdminPreview) {
          res = await api.get('/services/');
        } else if (username) {
          res = await api.get(`/services/public/${username}/`);
        } else {
          setLoading(false);
          return;
        }
        setServices(res.data.filter(s => s.is_active));
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isAdminPreview, username, previewContext?.liveServicesData]);

  // Subscribe to live updates
  useEffect(() => {
    if (isAdminPreview && previewContext?.liveServicesData) {
      setServices(previewContext.liveServicesData.filter(s => s.is_active));
    }
  }, [isAdminPreview, previewContext?.liveServicesData]);

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Package;
    return IconComponent;
  };

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

  if (services.length === 0) {
    return null; // Don't show section if no services
  }

  const featuredServices = services.filter(s => s.is_featured);
  const regularServices = services.filter(s => !s.is_featured);

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
            Services
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: isAdminPreview ? '0.875rem' : '1.125rem',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Professional services tailored to your needs
          </p>
        </motion.div>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${isAdminPreview ? '200px' : '300px'}, 1fr))`,
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            {featuredServices.map((service, index) => {
              const IconComponent = getIcon(service.icon);
              const priceType = PRICE_TYPES[service.price_type] || PRICE_TYPES.fixed;
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '1rem',
                    padding: isAdminPreview ? '1.25rem' : '2rem',
                    border: `2px solid ${accentColor}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Featured Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: `${accentColor}20`,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                  }}>
                    <Star size={12} style={{ color: accentColor, fill: accentColor }} />
                    <span style={{ fontSize: '0.75rem', color: accentColor, fontWeight: '600' }}>Featured</span>
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: isAdminPreview ? '3rem' : '4rem',
                    height: isAdminPreview ? '3rem' : '4rem',
                    backgroundColor: `${accentColor}20`,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <IconComponent size={isAdminPreview ? 24 : 32} style={{ color: accentColor }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: isAdminPreview ? '1rem' : '1.25rem',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '0.5rem',
                  }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#94a3b8',
                    fontSize: isAdminPreview ? '0.8125rem' : '0.9375rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                  }}>
                    {service.short_description || service.description}
                  </p>

                  {/* Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    borderTop: '1px solid #334155',
                  }}>
                    {service.price_type === 'contact' ? (
                      <span style={{ color: accentColor, fontWeight: '600', fontSize: '0.9375rem' }}>
                        Contact for Quote
                      </span>
                    ) : (
                      <span style={{ color: '#10b981', fontWeight: '700', fontSize: isAdminPreview ? '1.125rem' : '1.5rem' }}>
                        {priceType.prefix}${service.price}{priceType.suffix}
                      </span>
                    )}
                    <ArrowRight size={20} style={{ color: '#64748b' }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Regular Services */}
        {regularServices.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${isAdminPreview ? '180px' : '250px'}, 1fr))`,
            gap: '1rem',
          }}>
            {regularServices.map((service, index) => {
              const IconComponent = getIcon(service.icon);
              const priceType = PRICE_TYPES[service.price_type] || PRICE_TYPES.fixed;
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (featuredServices.length + index) * 0.1 }}
                  whileHover={{ y: -4 }}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    padding: isAdminPreview ? '1rem' : '1.5rem',
                    border: '1px solid #334155',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Icon & Title Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: isAdminPreview ? '2.5rem' : '3rem',
                      height: isAdminPreview ? '2.5rem' : '3rem',
                      backgroundColor: `${accentColor}15`,
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconComponent size={isAdminPreview ? 18 : 22} style={{ color: accentColor }} />
                    </div>
                    <h3 style={{
                      fontSize: isAdminPreview ? '0.9375rem' : '1.0625rem',
                      fontWeight: '600',
                      color: '#f8fafc',
                      margin: 0,
                    }}>
                      {service.title}
                    </h3>
                  </div>

                  {/* Short Description */}
                  {(service.short_description || service.description) && (
                    <p style={{
                      color: '#94a3b8',
                      fontSize: isAdminPreview ? '0.75rem' : '0.875rem',
                      lineHeight: '1.5',
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {service.short_description || service.description}
                    </p>
                  )}

                  {/* Price */}
                  {service.price_type === 'contact' ? (
                    <span style={{ color: accentColor, fontSize: '0.8125rem', fontWeight: '500' }}>
                      Contact for Quote
                    </span>
                  ) : service.price && (
                    <span style={{ color: '#10b981', fontWeight: '600', fontSize: isAdminPreview ? '0.9375rem' : '1.0625rem' }}>
                      {priceType.prefix}${service.price}{priceType.suffix}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
