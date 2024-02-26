import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/config';
import { toast } from 'react-toastify';
import updateData from '../hooks/useUpdate'

const Orders = () => {
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsername = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data. Status: ${res.status} - ${res.statusText}`);
      }

      const result = await res.json();
      return result.data.username;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const ordersResponse = await fetch(`${BASE_URL}/order?status=${status}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!ordersResponse.ok) {
        throw new Error(`Failed to fetch orders. Status: ${ordersResponse.status} - ${ordersResponse.statusText}`);
      }

      const ordersData = await ordersResponse.json();

      const userInfoPromises = ordersData.data.map(async (order) => {
        const username = await fetchUsername(order.user);
        return { ...order, username };
      });

      const updatedOrders = await Promise.all(userInfoPromises);
      setOrders(updatedOrders);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleAction = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus.toLowerCase() }), // Convert to lowercase
      });
  
      const { message } = await response.json();
  
      if (!response.ok) {
        toast.error(message);
        return;
      }
  
      toast.success('Successfully Updated.');
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (err) {
      toast.error('Error during updating.');
      console.error(err);
    }
  };

  const handlePayment = (orderId, value)=>{
    updateData(`${BASE_URL}/order/paymnet/${orderId}`,'payment', value);
    setTimeout(() => {
      fetchData();
    }, 1000);
  }

  return (
    <div className='data-box container-fluid pt-4'>
      <div className='row align-item-center justify-content-center'>
        <h1 className='dashboard-heading'>Orders</h1>
        <div className='d-flex align-item-center justify-content-between pt-5 flex-column flex-sm-row'>
          <div className='mt-3'>
            <h5 className='dashboard-text'>All Orders</h5>
          </div>
          <div className='d-flex gap-1 mb-1 align-items-end'>
            <button className={`filter-btn btn btn-light ${status === '' ? 'active' : ''}`} onClick={()=>{setStatus('')}}>All</button>
            <button className={`filter-btn btn btn-light ${status === 'preparing' ? 'active' : ''}`} onClick={()=>{setStatus('preparing')}}>Preparing</button> 
            <button className={`filter-btn btn btn-light ${status === 'delivering' ? 'active' : ''}`} onClick={()=>{setStatus('delivering')}}>Delivering</button> 
            <button className={`filter-btn btn btn-light ${status === 'cancelled' ? 'active' : ''}`} onClick={()=>{setStatus('cancelled')}}>Cancelled</button>
            <button className={`filter-btn btn btn-light ${status === 'delivered' ? 'active' : ''}`} onClick={()=>{setStatus('delivered')}}>Delivered</button> 
          </div>
        </div>
        <div className='col-12 table-responsive'>
        <table className="table table-box tours-table shadow">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Username</th>
              <th scope="col">Types of Items</th>
              <th scope="col">Address</th>
              <th scope="col">Total</th>
              <th scope="col">Payment</th>
              <th scope="col">Status</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            loading && <tr><td colSpan={9}>Loading.......</td></tr>
          }
          {
            error && <tr><td colSpan={9}>{error}</td></tr>
          }
          {!loading && !error &&
              orders?.map((order,index)=>(
            <tr key={order._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <td>{order.username}</td>
              <td>{order.items.length}</td>
              <td>{order.address}</td>
              <td>{order.total}</td>
              <td>
              <select
                  className="form-select"
                  value={order.payment? ('yes'):('no')}
                  onChange={(e) => handlePayment(order._id, e.target.value)}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </td>
              <td className='text-uppercase'>{order.status}</td>
              <td className='text-center'>
              {order.status === 'preparing' ? (
                <>
                  <button className='btn btn-light action-btn' onClick={() => handleAction(order?._id, 'delivering')} type="button">
                  <i className="ri-truck-line action-icon"></i>
                  </button>
                  &nbsp;
                  /
                  &nbsp;
                  <button className='btn btn-light action-btn' onClick={() => handleAction(order?._id, 'cancelled')} type="button">
                    <i className="ri-close-line action-icon"></i>
                  </button>
                </>
              ) : (order.status === 'delivering' ? (
                <>
                  <button className='btn btn-light action-btn' onClick={() => handleAction(order?._id, 'delivered')} type="button">
                    <i className="ri-check-line action-icon"></i>
                  </button>
                  &nbsp;
                  /
                  &nbsp;
                  <button className='btn btn-light action-btn' onClick={() => handleAction(order?._id, 'cancelled')} type="button">
                    <i className="ri-close-line action-icon"></i>
                  </button>
                </>
              ) : null)}
            </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

export default Orders