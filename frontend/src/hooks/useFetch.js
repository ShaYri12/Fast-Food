import React, { useState, useEffect } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        setError(null)
      try {
        const res = await fetch(url);

        if (!res.ok) {
          // Handle specific error cases
          if (res.status === 404) {
            throw new Error('Data not found');
          }

          // Handle other error cases
          throw new Error('Failed to fetch');
        }

        const result = await res.json();

        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    error,
    loading,
  };
};

export default useFetch;
