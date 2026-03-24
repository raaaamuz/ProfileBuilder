import React, { createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../utils/subdomain';

export const PublicTemplateContext = createContext({
  templateStyle: null,
  templateName: null,
  templateConfig: {},
  loading: true,
});

export const PublicTemplateProvider = ({ children }) => {
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  // Also check cached custom domain username (if already resolved by App.js)
  const cachedUsername = getUsernameSyncOnly();
  const username = urlUsername || subdomainUsername || cachedUsername;

  const [templateStyle, setTemplateStyle] = useState(null);
  const [templateName, setTemplateName] = useState(null);
  const [templateConfig, setTemplateConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('PublicTemplateContext: username from params:', username);
    if (!username) {
      console.log('PublicTemplateContext: No username, skipping fetch');
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        console.log('PublicTemplateContext: Fetching template for', username);
        const response = await api.get(`/templates/public/${username}/`);
        console.log('PublicTemplateContext: Got response', response.data);
        setTemplateStyle(response.data.template_style);
        setTemplateName(response.data.template_name);
        setTemplateConfig(response.data.config || {});
      } catch (error) {
        console.log('PublicTemplateContext: Error fetching template', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [username]);

  return (
    <PublicTemplateContext.Provider value={{
      templateStyle,
      templateName,
      templateConfig,
      loading,
    }}>
      {children}
    </PublicTemplateContext.Provider>
  );
};

export default PublicTemplateContext;
