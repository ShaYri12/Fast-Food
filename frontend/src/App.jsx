import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import './App.css'
import AdminLayout from './component/Layout/AdminLayout.jsx';
import ClientLayout from './component/Layout/ClientLayout.jsx';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user?.role === 'admin' ? (
        <AdminLayout />
      ) : (
        <ClientLayout />
      )}
    </div>
  );
}

export default App;
