import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/food-detail.css'
import calculateAvgRating from '../utils/avgRating';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { useFetch as useAuthenticatedFetch, authenticatedFetch } from '../utils/api';
import { getUserId } from '../utils/getUserId';

import Avatar from '/images/avatar.jpg'
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';

const FoodDetaill = () => {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const Navigate = useNavigate();
  const { id } = useParams();
  const { data: food, loading, error } = useFetch(`${BASE_URL}/menus/${id}`);
  const reviewMsgRef = useRef('');
  const [foodRating, setFoodRating] = useState(null);

  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  const { totalRating, avgRating } = calculateAvgRating(food?.reviews);
  const deleveryCharges = 100;
  const TotalAmount = quantity * food?.price + deleveryCharges;
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  // Use user data directly from context instead of making API call
  const userinfo = user;
  const userId = getUserId(user);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleManualQuantityChange = (e) => {
    const enteredValue = parseInt(e.target.value, 10);
    if (!isNaN(enteredValue) && enteredValue > 0) {
      setQuantity(enteredValue);
    } else {
      // If the entered value is not a positive number, reset to 1
      setQuantity(1);
    }
  };

  if (!food) {
    return <div>Item not found</div>;
  }
  const {photo, title, desc, price, reviews, category} = food;
  
  
  
  const submitHandler = async e =>{
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    
    try{
      if(!userinfo || userinfo===undefined || userinfo ===null){
        toast.error('Please Sign-In')
      }
      const reviewObj = {
        username: userinfo?.username,
        reviewText,
        rating: foodRating
      }

      const res = await fetch(`${BASE_URL}/review/${id}`,{
        method:'post',
        headers:{
          'content-type':'application/json'
        },
        credentials:'include',
        body: JSON.stringify(reviewObj)
      })
      
      const result = await res.json()
      if(!res.ok){
        return toast.error(result.message)
      }

      toast.success(result.message)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }catch(err){
      toast.error(err.message)
    }
  }

  
  const handleAddToCart = async () => {
    try {
      if (!userinfo) {
        return toast.error('Please Sign-In');
      }
  
      console.log('=== Add to Cart Debug ===');
      console.log('User info:', userinfo);
      console.log('User ID from getUserId:', userId);
      
      const cartItem = {
        userId: userId,
        foodId: id,
        foodName: food && food.title,
        quantity: quantity,
        price: food && food.price,
        photo: food && food.photo,
        category: food && food.category,
      };
      
      console.log('Cart item to send:', cartItem);
      
      const result = await authenticatedFetch(`${BASE_URL}/cart/addtocart`, {
        method: 'POST',
        body: JSON.stringify(cartItem),
      });
  
      toast.success('Item added in cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'An error occurred while processing your request');
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    await handleAddToCart();
    Navigate(`/cart/${userId}`);
  };

  

  return (
    <section>
      <div className="container">
      {loading && <Spinner/>}
          {error && <h4 className='text-center pt-5'>{error}</h4>}
          {
            !loading && !error &&
        <div className="row align-items-center justify-content-center" key={id}>
          <div className="col-md-7 col-12 mb-3 mb-md-0">
            <img className='food-item-img  img-fluid rounded-2' src={photo} alt="FoodImg" />
          </div>
          <div className="food-info col-md-5 col-12 position-sticky">
                <h1>{title}</h1>
                <span className='food-rating d-flex gap-1 mb-1' >
                Rating: 
                    <i className="ri-star-fill"></i>
                        <span className='num'>{avgRating == 0 ? null : avgRating}</span>
                        {totalRating == 0 ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Not Rated</span>:(
                            <span>({reviews?.length})</span>
                        )}
                    </span>
                    <p className='mb-2 '>Category: {category}</p>
                <p>{desc}</p>  
              <div className="quantity d-flex align-items-center justify-content-between mb-3">
                <h6>Quantity: </h6>
                <div className="input-group w-auto justify-content-end align-items-center">
                  <input
                    type="button"
                    value="-"
                    className="button-minus border rounded-circle  icon-shape icon-sm mx-1 lh-0"
                    data-field="quantity"
                    onClick={() => handleQuantityChange('decrease')}
                  />
                  <input
                    type="number"
                    step="1"
                    value={quantity}
                    name="quantity"
                    onBlur={handleManualQuantityChange}
                    onChange={((e)=>setQuantity(e.target.value))}
                    className="quantity-field border-0 text-center w-25"
                  />
                  <input
                    type="button"
                    value="+"
                    className="button-plus border rounded-circle icon-shape icon-sm lh-0 ms-1"
                    data-field="quantity"
                    onClick={() => handleQuantityChange('increase')}
                  />
                </div>
              </div>
              <div>
                <p className='d-flex justify-content-between align-items-center'>
                    Price: <span>{quantity} <i className='ri-close-line'></i> Rs.{price}</span>
                </p>
                <p className='d-flex justify-content-between align-items-center'>
                    Delevery Charges: <span>Rs.{deleveryCharges}</span>
                </p>
                <h5 className='d-flex justify-content-between align-items-center'>
                    Total Amount: <span>Rs.{TotalAmount}</span>
                </h5>
              </div>
              <div className="d-flex justify-content-between mt-4 gap-3">
                <button className="btn btn-warning" onClick={handleAddToCart}><i className="ri-shopping-cart-line"></i> Add to Cart</button>
                <Link className="btn order-btn btn-light" onClick={handleOrder}>Order</Link>
              </div>
          </div>
        </div>
          }
          {/* ============== Tour-Reviews-Section-Start ============== */}

          <div className="tour-reviews mt-5 col-lg-7 col-12 order-5">
            <h5>Reviews ({reviews?.length} reviews)</h5>
            <form onSubmit={submitHandler}>
            <div className="food-rating rating-group d-flex align-items-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setFoodRating((prevRating) => (prevRating === star ? null : star))}
                  className={foodRating && star <= foodRating ? 'active' : ''}
                >
                  <i className={foodRating && star <= foodRating ? 'ri-star-fill' : 'ri-star-line'}></i>
                </span>
              ))}
            </div>
                <div className='review-input'>
                  <input type="text" ref={reviewMsgRef} placeholder='Share your thoughts' required/>
                  <button className='review-btn btn btn-primary rounded-5'  type="submit"> Submit </button>
                </div>
            </form>

            <div className='form-group-reviews'>
            {reviews?.map((review,index) =>(
                <div className='review-item mt-4 d-flex ' key={index}>
                  <img className="review-img img-fluid me-1 rounded-circle" src={Avatar} alt="" />
                  <div className='w-100'>
                      <div className='d-flex align-items-center justify-content-between'>
                      <div className="align-items-center justify-content-center">
                          <h5 className="mb-0">{review.username}</h5>
                          <p className="review-date mb-1 pt-0">{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                      </div>
                      <span className='food-rating d-flex align-items-center'>
                          {review.rating}<i className='ri-star-s-fill'></i>
                      </span>
                      </div>
                      <h6>{review.reviewText}</h6>
                  </div>
                </div>
            ))}
            </div>
        </div>

        {/* ============== Tour-Reviews-Section-End ============== */}

      </div>
    </section>
  );
}

export default FoodDetaill