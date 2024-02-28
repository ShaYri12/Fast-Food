import React, { useEffect, useState } from 'react';
import './create-food.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/config';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../component/Spinner';

const UpdateFood = () => {
  const {id} = useParams();
  const{data: food, loading, error}= useFetch(`${BASE_URL}/menus/${id}`)

  const navigate = useNavigate()
console.log(food)

useEffect(() => {
  // Check if the food data has been fetched
  if (food) {
    setFoodData({
      title: food.title || '',
      category: food.category || '',
      price: food.price || 0,
      photo: food.photo || '',
      desc: food.desc || 0,
      special: food.special || false,
    });
  }
}, [food]);

  const [foodData, setFoodData] = useState({
    title: food.title || '',
    category: food.category || '',
    price: food.price || 0,
    photo: food.photo || '',
    desc: food.desc || 0,
    special: food.special || false,
  })

  
  const handleChange = e =>{
    setFoodData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const cloudinaryConfig = {
    cloudName: 'dazko9ugd',
    apiKey: '229314452358913',
    apiSecret: 'a60Y6vKeapSAgxHNtGpOsPhwNGY',
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    if (!foodData.title || !foodData.category || !foodData.price || !foodData.desc || !foodData.photo || !foodData.special) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      if (foodData.photo) {
        const formData = new FormData();
        formData.append('file', foodData.photo);
  
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload?upload_preset=qsimo6w7`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryResponse.json();
        foodData.photo = cloudinaryData.secure_url;
      }

      const response = await fetch(`${BASE_URL}/menus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(foodData),
      });
  
      const { message } = await response.json();
  
      if (!response.ok) {
        toast.error(message);
        return;
      }
  
      toast.success("Successfully Updated The Food.");
      navigate('/menu')
    } catch (err) {
      toast.error("Error updating Food.");
      console.error(err);
    }
  };

  if(loading){
    return <Spinner/>
  }
  return (
    <>
    <div className='d-flex w-100 align-items-center justify-content-center vh-100'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 shadow-lg rounded-2'>
            <form>
              <h1 className='text-center mb-5 mt-3'>Update The Food</h1>
              <div className="input-fields input-group mb-3 d-flex flex-column flex-sm-row gap-3 gap-md-0">
              <div className='d-flex  flex-grow-1'>
                <span className="input-group-text">Food Title:</span>
                <input type="text" name="title" value={foodData.title} className="form-control" placeholder="Title of the food" onChange={handleChange} />
                </div>
                <div className='d-flex flex-grow-1 '>
                <span className="input-group-text">Category:</span>
                <input type="text" name="category" value={foodData.category} className="form-control" placeholder="Category of the food" onChange={handleChange} />
                </div>
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Price:</span>
                <input type="number" name="price" value={foodData.price} className="form-control" placeholder="Price of the food" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Description:</span>
                <textarea  rows="5" name="desc" value={foodData.desc} className="form-control" placeholder="Description of the food" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Special:</span>
                <select name="special" value={foodData.special} className='rounded-2' onChange={handleChange} >
                  <option value="false">&nbsp;No&nbsp;</option>
                  <option value="true">&nbsp;Yes&nbsp;</option>
                </select>
              </div>
              <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="inputGroupFile01">Food Pic</label>
                  <input
                  type="file"
                  className="form-control"
                  name="photo"
                  id="inputGroupFile01 photo"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setFoodData({ ...foodData, photo: e.target.files[0] })}
                />
              </div>
              <div className='justify-content-end d-flex'>
                <button type="submit" onClick={handleUpdateFood} className='btn btn-light create-tour-btn mb-3'> <i className="ri-file-add-line"></i>   Update Food</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default UpdateFood;