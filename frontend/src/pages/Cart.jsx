import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/config';
import '../styles/cart.css'
import CartItem from '../shared/CartItem';
import { authenticatedFetch } from '../utils/api';

import mastercard from '/images/mastercard.png'
import paypal from '/images/paypal.png'
import cashondelivery from '/images/cashondelivery.png'
import jazzcash from '/images/jazzcash.png'
import { toast } from 'react-toastify';

const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const { id } = useParams();

  const [userCart, setUserCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [location, setLocation] = useState('');
  const [addressError, setAddressError] = useState('');
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setLocation(e.target.value);
    // Clear address error when user starts typing
    if (addressError) {
      setAddressError('');
    }
  };

  const deleverycharges = 100;

  // Function to fetch cart data
  const fetchCartData = async () => {
    setCartLoading(true);
    setCartError(null);
    
    try {
      const result = await authenticatedFetch(`${BASE_URL}/cart/${id}`);
      setUserCart(result.data || []);
    } catch (err) {
      console.error('Cart fetch error:', err);
      setCartError(err.message);
      setUserCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Function called when quantity changes - update local state instead of refetching
  const quantityChanges = (cartItemId, newQuantity) => {
    setUserCart(prevCart => 
      prevCart.map(item => 
        item._id === cartItemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Function to refetch cart data (for when we need to sync with server)
  const refetchCartData = () => {
    fetchCartData();
  };

  // Initial cart data fetch
  useEffect(() => {
    fetchCartData();
  }, [id]);

  // Calculate totals when cart data changes
  useEffect(() => {
    if (userCart.length !== 0 && !cartLoading && !cartError) {
      // Calculate subtotal
      const calculatedSubtotal = userCart.reduce(
        (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);

      // Calculate total
      const calculatedTotal = calculatedSubtotal + deleverycharges;
      setTotal(calculatedTotal);
    } else {
      setSubtotal(0);
      setTotal(deleverycharges);
    }
  }, [userCart, cartLoading, cartError]);
    
  const handleOrder = async(e)=>{
    e.preventDefault();
    
    // Validate address
    if (!location || location.trim() === '') {
      setAddressError('Please enter your delivery address');
      return;
    }
    
    const userId= id;
    const items = userCart?.map((item) => ({
      foodId: item.foodId,
      name: item.foodName,
      qty: item.quantity,
    }));
    const address = location.trim();
    const totalAmount = total;
  
    try {
      // Create the order first
      const orderResult = await authenticatedFetch(`${BASE_URL}/order/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ userId, items, address, totalAmount }),
      });

      console.log('Order created successfully:', orderResult);

      // Clear the cart on the server
      await authenticatedFetch(`${BASE_URL}/cart/${id}`, {
        method: 'DELETE',
      });

      // Clear the cart in local state immediately
      setUserCart([]);
      setSubtotal(0);
      setTotal(deleverycharges);
      setLocation('');

      toast.success('Order placed successfully!');
      Navigate('/thank-you');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to create order');
    }
  }
    
return (
    <div className='container'>
        <div className='row'>
            <div className='col-lg-8 col-12 mt-5 mb-3'>
            <h1 className=''>Cart</h1>
            <hr/>
            <div className='table-responsive'>
            <table className="table">
            <thead>
              <tr>
                <th scope="col" className='text-center'>#</th>
                <th scope="col">Item</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
                <th scope="col" className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">Loading.......</td>
                </tr>
              ) : (
                cartError ? (
                  <tr>
                    <td colSpan={6} className="text-center text-danger">{cartError}</td>
                  </tr>
                ) : userCart.length !== 0 ? (
                  userCart.map((cart, index) => (
                    <tr key={cart._id}>
                      <th scope="row" className='text-center'>{index + 1}</th>
                      <CartItem cart={cart} quantityChanges={quantityChanges}/>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <h3 className="text-center py-3 font-size-5">Cart is Empty</h3>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          
              </div>
        </div>
        
        <div className={`payment-box shadow d-flex flex-column border border-2 col-lg-4 col-12 mt-5 ${userCart.length === 0 ? 'disabled' : ''}`}>
        {userCart.length === 0 && (
          <div className="disabled-overlay">
            <p className='why-disabled'>Your cart is empty. Add items to proceed.</p>
          </div>
        )}
          <h1 className="pt-3 pb-0 mb-0 text-center">Payment</h1>
          <hr/>
          <div className='payment-method'>
            <h5>Payment Method:</h5>
            <div className='d-flex align-items-center justify-content-center'>
              <button className='btn me-1 active' ><img className='img-fluid' src={cashondelivery} alt=""/></button>
              <button className='btn me-1 disabled'><img className='img-fluid' src={mastercard} alt=""/></button>
              <button className='btn me-1 disabled'><img className='img-fluid' src={jazzcash} alt=""/></button>
              <button className='btn me-1 disabled'><img className='img-fluid' src={paypal} alt=""/></button>
            </div>
            <hr/>
            <form>
            <div className='address-field form-group mb-3'> 
              <h6>Address:</h6>
              <textarea 
                className={`address-input ${addressError ? 'border-danger' : ''}`} 
                type="text" 
                placeholder='Address'  
                id="location" 
                value={location}
                onChange={handleChange} 
                required
              />
              {addressError && (
                <div className="text-danger mt-1 small">
                  {addressError}
                </div>
              )}
            </div>
            <hr/>
            <div className='total'>
                <div className='list-group'>
                  <div className='list-group-item d-flex justify-content-between border-0 px-0'>
                    <h6>SubTotal</h6>
                    <span> Rs.{subtotal}</span>
                  </div>
                  <div className='list-group-item d-flex justify-content-between border-0 px-0'>
                    <h6>Delivery Charges </h6>
                    <span> Rs.{deleverycharges}</span>
                  </div>
                  <div className='list-group-item d-flex justify-content-between border-0 px-0'>
                    <h6>Total Amount</h6>
                    <span> Rs.{total}</span>
                  </div>
                </div>  
              <button onClick={handleOrder} className={`${userCart.length === 0 ? 'disabled' : ''}checkout-btn px-4 btn w-100 btn-primary flex-grow-1 mb-2 d-flex align-items-center justify-content-between`}>
                <span>Rs.{total}</span>
                <span>Confirm Order<i className="ri-arrow-right-line"></i></span>
              </button>
            </div>
            </form>
          </div>
        </div>
    </div>
  </div>
  )
}

export default Cart