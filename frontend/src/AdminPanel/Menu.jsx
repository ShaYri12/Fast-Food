import React, { useState } from 'react'
import './styles/data-table.css'
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import calculateAvgRating from '../utils/avgRating';
import deleteData from '../hooks/useDelete';
import { Link } from 'react-router-dom';


const Menu = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const {data: menu, loading, error} = useFetch(`${BASE_URL}/menus?page=${currentPage-1}`)
  const {data: foodCount} = useFetch(`${BASE_URL}/menus/search/getMenuCount`)
  const totalPages = Math.ceil(foodCount / 8);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  
  
  
  return (
    <div className='data-box container-fluid pt-4'>
      <div className='row align-item-center justify-content-center'>
        <h1 className='dashboard-heading'>Menu</h1>
        <div className='d-flex align-item-center justify-content-between pt-5 mt-3 mb-1'>
            <h5 className='dashboard-text'>All Foods</h5>
            <Link className='add-tour-btn btn btn-light' to="/createfood"><i className="ri-file-add-line"></i> Create Food</Link>
        </div>
        <div className='col-12 table-box '>
        <table className="table tours-table shadow">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Item</th>
              <th scope="col">Category</th>
              <th scope="col">Rating</th>
              <th scope="col">Price</th>
              <th scope="col">Special</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>  
          {
            loading && <tr><td colSpan={7}>Loading.......</td></tr>
          }
          {
            error && <tr><td colSpan={7}>{error}</td></tr>
          }
          {!loading && !error &&
              menu?.map((item,index)=>(
            <tr key={item._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <AllMenuData item={item}/>
            </tr>
          ))}
          </tbody>
        </table>
 
        </div>
        <div className='pagination d-flex align-items-center justify-content-center mt-2 mb-5 gap-3'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active-page' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
      </div>
    </div>
  )
}

export default Menu;


export const AllMenuData = ({item}) => {

  
  const {_id, title, category, photo, price, special, reviews,} = item;
  
  const handleDelete = (foodId) => {
    deleteData(`${BASE_URL}/menus/${tourId}`);
  };
   
  const {totalRating, avgRating} = calculateAvgRating(reviews);

  return (
    <>
    
              <td><img  className='img-fluid rounded-2 menu-item-img' src={photo}/> {title}</td>
              <td>{category}</td>
              <td>
              {avgRating === 0 ? null : avgRating}
                    {totalRating === 0 ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Not Rated</span>:(
                        <span>({reviews.length})</span>
                    )}
              </td>
              <td>Rs.{price}</td>
              <td>{special? ('Yes'):('No')}</td>
              <td className='text-center'>
                <Link className='btn btn-light action-btn' to={`/updatefood/${_id}`}>
                  <i className="ri-edit-box-line action-icon edit-icon"></i>
                  </Link>
                  &nbsp;
                   / 
                   &nbsp;
                  <button className='btn btn-light action-btn' type="button" onClick={() => handleDelete(_id)}>
                    <i className="ri-delete-bin-line action-icon delete-icon"></i>
                  </button>
                </td>
    </>
  )
}
