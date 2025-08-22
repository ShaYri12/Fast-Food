import React, { useState } from 'react'
import { BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';
import { authenticatedFetch } from '../utils/api';

const CartItem = ({cart, quantityChanges}) => {

    const {_id, userId, foodId, photo, foodName, price, quantity,} = cart
    const [newQuantity, setNewQuantity] = useState(quantity);
    const deleveryCharges = 100;

    const handleQuantityChange = (action) => {
      let updatedQuantity;

      if (action === 'increase') {
        updatedQuantity = newQuantity + 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        updatedQuantity = newQuantity - 1;
      } else {
        return;
      }

      // Update UI immediately for fast response
      setNewQuantity(updatedQuantity);
      quantityChanges(_id, updatedQuantity);

      // Update server asynchronously in the background
      const updateServer = async () => {
        try {
          const cartItem = {
            userId: userId,
            foodId: foodId,
            quantity: updatedQuantity,
          };

          await authenticatedFetch(`${BASE_URL}/cart/quantity`, {
            method: 'PUT',
            body: JSON.stringify(cartItem),
          });
        } catch (err) {
          // If server update fails, revert the UI changes
          setNewQuantity(newQuantity);
          quantityChanges(_id, newQuantity);
          toast.error('Error updating quantity. Please try again.');
          console.error('Quantity update error:', err);
        }
      };

      updateServer();
    };
  
      const handleManualQuantityChange = (e) => {
        const enteredValue = parseInt(e.target.value, 10);
        
        if (!isNaN(enteredValue) && enteredValue > 0) {
          // Update UI immediately
          setNewQuantity(enteredValue);
          quantityChanges(_id, enteredValue);

          // Update server asynchronously
          const updateServer = async () => {
            try {
              const cartItem = {
                userId: userId,
                foodId: foodId,
                quantity: enteredValue,
              };

              await authenticatedFetch(`${BASE_URL}/cart/quantity`, {
                method: 'PUT',
                body: JSON.stringify(cartItem),
              });
            } catch (err) {
              // If server update fails, revert to original quantity
              setNewQuantity(quantity);
              quantityChanges(_id, quantity);
              toast.error('Error updating quantity. Please try again.');
              console.error('Manual quantity update error:', err);
            }
          };

          updateServer();
        } else {
          // If the entered value is not a positive number, reset to original quantity
          setNewQuantity(quantity);
          quantityChanges(_id, quantity);
        }
      };
            
      

  const handleRemove = async(_id) => {
    try {
      const result = await authenticatedFetch(`${BASE_URL}/cart/${_id}`, {
        method: 'DELETE',
      });

      toast.info('Removed the item from the cart.');
      setTimeout(()=>{ 
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error('Error during deletion.');
      console.log(err);
    }
  };

  return (
    <>
        <td className='item-column'><img className='cart-item-img img-fluid rounded-2 me-3' src={photo} alt=""/>{foodName}</td>
        <td>{price}</td>
        <td>
        <div className="quantity d-flex align-items-center justify-content-between">
        <div className="input-group w-auto justify-content-end align-items-center justify-content-center">
        <input
            type="button"
            value="-"
            className="button-minus border rounded-circle  icon-shape icon-sm  "
            onClick={() => handleQuantityChange('decrease', _id)}
        />
        <input
            type="number"
            step="1"
            value={newQuantity}
            name="quantity"
            onBlur={handleManualQuantityChange}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="quantity-field border-0 text-center w-25 mx-1"
        />
        <input
            type="button"
            value="+"
            className="button-plus border rounded-circle icon-shape icon-sm lh-0"
            onClick={() => handleQuantityChange('increase', _id)}
        />
        </div>
    </div>
        </td>
        <td>{(price * newQuantity) + deleveryCharges}</td>
        
        <td className='text-center'>
        <button type="button" className='remove-btn btn btn-danger' onClick={() => handleRemove(_id)}><i className="ri-delete-bin-line"></i></button>
        </td>
    
  </>
  )
}

export default CartItem