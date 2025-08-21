import React, { useContext } from 'react';
import { Routes, Route, Navigate   } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx';
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Menu from '../pages/Menu.jsx'
import Cart from '../pages/Cart.jsx'
// import Tours from '../pages/Tours'
// import TourDetails from '../pages/TourDetails'
// import SearchResultList from '../pages/SearchResultList'
import ThankYou from '../pages/ThankYou.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import FoodDetaill from '../pages/FoodDetaill.jsx'
import MyAccount from '../pages/MyAccount.jsx'
import MyOrders from '../pages/MyOrders.jsx';



const Routers = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
        <Route path="/home" element={<Navigate to='/'/>}/>
        <Route path="/" element={<Home />}/>
        <Route path="/menu" element={<Menu />}/>
        <Route path="/fooddetail/:id" element={<FoodDetaill />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/thank-you" element={<ThankYou />}/>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />}/>

        { /* Protected Routes */ }
        <Route 
          path="/my-account/:id" 
          element={user ? <MyAccount /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/cart/:id" 
          element={user ? <Cart /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-orders/:id" 
          element={user ? <MyOrders /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to='/'/>} />
    </Routes>

  )
}

export default Routers