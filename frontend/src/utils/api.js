import React, { useState, useEffect } from 'react';
import { BASE_URL } from './config';

export const authenticatedFetch = async (url, options = {}) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add Authorization header if user has a token
  if (user && user.token) {
    defaultHeaders['Authorization'] = `Bearer ${user.token}`;
  }
  
  const config = {
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };
  
  console.log('Making authenticated request to:', url);
  console.log('With headers:', config.headers);
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  return response.json();
};

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      
      setLoading(true);
      setError(null);

      try {
        const result = await authenticatedFetch(url);
        setData(result.data || result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};