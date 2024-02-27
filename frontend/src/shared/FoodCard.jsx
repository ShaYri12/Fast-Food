import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './food-card.css'
import calculateAvgRating from '../utils/avgRating';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';

export const FoodCard = ({item}) => {
    const {_id, title, photo, category, price, desc, reviews} = item;
    const {totalRating, avgRating} = calculateAvgRating(reviews);
    const {user} = useContext(AuthContext)

    const handleAddToCart = async (foodId) => {
        try {
          if (!user) {
            return toast.error('Please Sign-In');
          }
      
          const cartItem = {
            userId: user._id,
            foodId: foodId,
            foodName: title,
            quantity: 1,
            price: price,
            photo: photo,
            category: category,
          };
          
      
          const response = await fetch(`${BASE_URL}/cart/addtocart`, {
            method: 'post',
            headers: {
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(cartItem),
          });
      
          const result = await response.json();
      
          if (!response.ok) {
            return toast.error(result.message || 'Failed to add item to the cart');
          }
      
          toast.success('Item added in cart');
        } catch (error) {
          console.error(error);
          toast.error('An error occurred while processing your request');
        }
      };
  
  return (
        <div className="card food-card shadow" key={_id}>
            <div className='food-img'>
                <button className='cart-icon' onClick={() => handleAddToCart(_id)}><i className="ri-shopping-cart-fill"></i></button>
                <img src={photo} className="card-img-top img-fluid" alt="CardImg"/>
                <span> {category}</span>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between'>
                    <h5 className="tour-title"  style={{whiteSpace: "nowrap", overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        <Link to={`/fooddetail/${_id}`}>{title}</Link>
                    </h5>
                    <span className='food-rating d-flex ' >
                    <i className="ri-star-fill"></i>
                        <span className='num'>{avgRating == 0 ? null : avgRating}</span>
                        {totalRating == 0 ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NR</span>:(
                            <span>({reviews.length})</span>
                        )}
                    </span>
                </div>
                <p className="card-text">{desc}</p>
                <div className="card-bottom my-auto d-flex align-items-center justify-content-between mt-3">
                    <h5 className='my-auto'>
                        Rs.{price} <span></span>
                    </h5>
                    <Link className="btn order-btn" to={`/fooddetail/${_id}`}>Order</Link>
                </div>
            </div>
        </div>
  )
}
