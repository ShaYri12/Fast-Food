import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '/images/logo.png'
import Avatar from '/images/avatar.jpg';
import './header.css'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/config'

const Header = () => {
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const navbar = document.querySelector('.navbar');

      if (currentScrollPos > 0) {
        // Add shadow class when scrolling down
        navbar.classList.add('shadow');
      } else {
        // Remove shadow class when at the top
        navbar.classList.remove('shadow');
      }

      if (prevScrollpos > currentScrollPos) {
        navbar.style.top = '0';
      } else {
        navbar.style.top = '-80px';

        // Close the Navbar when scrolling down
        const togglerButton = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('#navbarSupportedContent');

        if (togglerButton.classList.contains('offcanvas')) {
          togglerButton.classList.remove('offcanvas');
          navbarCollapse.classList.remove('show');
        }
      }

      prevScrollpos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup the event listener when the component is unmounted
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  const navigate = useNavigate();
  

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
  
  const { user, dispatch } = useContext(AuthContext);
  
  const { data: userinfo, loading, error } = useFetch(user ? `${BASE_URL}/users/${user._id}` : null);
  
  


  const logout = () =>{
    dispatch({type:'LOGOUT'})
    toast.success('Logout Successfully!')
    navigate('/')
  }

  return (
    <>
    <div className='d-block navbar-behind'></div>
    <nav className="navbar navbar-expand-md bg-white fixed-top ">
  <div className="container ">
    <NavLink className="navbar-brand logo" to="/"><img className='img-fluid' src={Logo} alt="logo"/></NavLink>
    <button className="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="offcanvas offcanvas-end " tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Chilli Panda</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body align-item-center" id="navbarSupportedContent">
        <ul className="navbar-nav justify-content-center flex-grow-1 pe-2">
          <li className="nav-item mx-auto mx-md-2">
            <NavLink className="nav-link " aria-current="page" to="/">Home</NavLink>
          </li>
          <li className="nav-item mx-auto mx-md-2">
            <NavLink className="nav-link" to="/menu">Menu</NavLink>
          </li>
          <li className="nav-item mx-auto mx-md-2">
            <NavLink className="nav-link" to="/about">About</NavLink>
          </li>
        </ul>
        {user?(
          <>
          <div className='cart d-flex align-items-center justify-content-center'>
            <NavLink className='btn cart-btn' to={`/cart/${userinfo._id}`}><i className="ri-shopping-cart-fill"></i></NavLink>
          </div>
          <div className="profile dropdown align-items-center d-flex flex-column justify-content-center">
            <button className="nav-link dropdown-toggle d-flex flex-column flex-md-row  align-items-center" to="/" role="button" data-bs-toggle="dropdown" aria-expanded="false"> 
              <img src={userinfo.photo || Avatar} className='profileimg img-fluid rounded-circle border' alt=""/>  
            </button>
            <ul className="dropdown-menu text-center">
              <li><NavLink className="dropdown-item" to={`/my-orders/${userinfo._id}`}>My Orders</NavLink></li>
              <li><NavLink className="dropdown-item" to={`/my-account/${userinfo._id}`}>Profile</NavLink></li>
              <li>
                <hr className="dropdown-divider"/>
              </li>
              <li><NavLink className="dropdown-item" to="/logout" onClick={logout}>Logout</NavLink></li>
            </ul>
          </div>
          </>
          ):(
        <div className='mx-auto mx-md-2 d-flex flex-column flex-md-row gap-2'>
          <Link to="/login" className='btn-signin btn btn-primary mx-auto'>SignIn</Link>
        </div>
        )}
      </div>
    </div>
  </div>
</nav>
</>
  )
}

export default Header