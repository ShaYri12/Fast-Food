import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import './App.css'
import { BASE_URL } from './utils/config.js';
import AdminLayout from './component/Layout/AdminLayout.jsx';
import ClientLayout from './component/Layout/ClientLayout.jsx';
import ReactLoading from 'react-loading';

function App() {
  const { user } = useContext(AuthContext)
  
  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);

        try {
          const res = await fetch(url, {
            method: "GET",
            credentials:'include',
          });
          if (!res.ok) {
            throw new Error(`Failed to fetch data from ${url}. Status: ${res.status} - ${res.statusText}`);
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

    return { data, loading, error };

  }
  const {data: userData, loading, error} = useFetch(`${BASE_URL}/users/${user?._id}`)
  
  return (
    loading ? (
      <div className="container w-25 d-flex align-items-center min-vh-100 justify-content-center">
        <ReactLoading type="spin" color="var(--primary-color)" height={'20%'} width={'20%'} />
      </div>
        ):(
    <div>
    
    {!loading && !error &&
      userData?.role  == 'admin' ? (
        <AdminLayout />
      ) : (
        <ClientLayout />
      )}
    </div>
    )
  );
}

export default App;
