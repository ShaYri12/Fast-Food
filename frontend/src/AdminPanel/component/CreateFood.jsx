import React, { useState } from 'react';
import './create-food.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/config';

const CreateFood = () => {
  const [menuData, setMenuData] = useState({
    title: '',
    category: '',
    price: 0,
    photo: '',
    desc: '',
    special: false
  })

  const navigate = useNavigate()

  const handleChange = e =>{
    setMenuData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const cloudinaryConfig = {
    cloudName: 'dazko9ugd',
    apiKey: '229314452358913',
    apiSecret: 'a60Y6vKeapSAgxHNtGpOsPhwNGY',
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    if (!menuData.title || !menuData.category || !menuData.price  || !menuData.desc||  !menuData.photo) {
      toast.error("Please fill in all required fields.");
      return;
    }else{
  
    try {
      if (menuData.photo) {
        const formData = new FormData();
        formData.append('file', menuData.photo);
  
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload?upload_preset=qsimo6w7`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryResponse.json();
        menuData.photo = cloudinaryData.secure_url;
      }

      const response = await fetch(`${BASE_URL}/menus`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(menuData),
      });
  
      const { message } = await response.json();
  
      if (!response.ok) {
        toast.error(message);
        return;
      }
  
      toast.success("Successfully created a new food.");
      navigate('/menu')
    } catch (err) {
      toast.error("Error creating food.");
      console.error(err);
    }
  }
  };

  return (
    <>
    <div className='d-flex w-100 align-items-center justify-content-center vh-100'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 shadow-lg rounded-2'>
            <h1 className='text-center mb-5 mt-3'>Create A New Food</h1>
            
            <form onSubmit={handleCreateFood}>
              <div className="input-fields input-group mb-3 d-flex flex-column flex-sm-row gap-3 gap-md-0">
              <div className='d-flex  flex-grow-1'>
                <span className="input-group-text">Food Title:</span>
                <input type="text" name="title" className="form-control" placeholder="Title of the food" onChange={handleChange} />
                </div>
                <div className='d-flex flex-grow-1 '>
                <span className="input-group-text">Category:</span>
                <input type="text" name="category" className="form-control" placeholder="Category of the food" onChange={handleChange} />
                </div>
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Price:</span>
                <input type="number" name="price" className="form-control" placeholder="Price of the food" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Description:</span>
                <textarea  rows="5" name="desc" className="form-control" placeholder="Description of the food" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Special:</span>
                <select name="special" className='rounded-2' onChange={handleChange} >
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
                  onChange={(e) => setMenuData({ ...menuData, photo: e.target.files[0] })}
                />
              </div>
              <div className='justify-content-end d-flex'>
                <button type="submit" onClick={handleCreateFood} className='btn btn-light create-food-btn mb-3'> <i className="ri-file-add-line"></i>   Create Food</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreateFood