import React from 'react'
import { Link } from 'react-router-dom'
import './food-card.css'
import calculateAvgRating from '../utils/avgRating';

export const FoodCard = ({item}) => {
    const {_id, title, photo, category, price, desc, reviews} = item;
    const {totalRating, avgRating} = calculateAvgRating(reviews);
  
  return (
        <div className="card food-card shadow" key={_id}>
            <div className='food-img'>
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
