import React, { useContext } from 'react';
import { Routes, Route, Navigate   } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx';
import MyAccount from '../pages/MyAccount.jsx'
import Dashboard from '../AdminPanel/Dashboard.jsx'
import Menu from '../AdminPanel/Menu.jsx'
import Orders from '../AdminPanel/Orders.jsx'
import Users from '../AdminPanel/Users.jsx'
import Admins from '../AdminPanel/Admins.jsx'
import CreateFood from '../AdminPanel/component/CreateFood.jsx';
import UpdateFood from '../AdminPanel/component/UpdateFood.jsx'

import Login from '../pages/Login.jsx';

const AdminRouters = () => {
  const { user } = useContext(AuthContext);
  
  // If no user or user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    return (
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/menu" element={<Menu />}/>
        <Route path="/orders" element={<Orders />}/>
        <Route path="/users" element={<Users />}/>
        <Route path="/admins" element={<Admins />}/>
        <Route path="/createfood" element={<CreateFood />}/>
        <Route path="/updatefood/:id" element={<UpdateFood />}/>
        <Route path="/my-account/:id" element={<MyAccount />} />
        <Route path="*" element={<Navigate to='/dashboard'/>} />
    </Routes>
  )
}

export default AdminRouters