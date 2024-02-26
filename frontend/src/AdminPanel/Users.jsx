import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/config';
import Avatar from '../assets/images/avatar.jpg';
import updateData from '../hooks/useUpdate'
import deleteData from '../hooks/useDelete'

const Users = () => {
  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
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

    useEffect(() => {
      fetchData();
    }, [url]);

    return { data, loading, error, fetchData };
  };

  const { data: users, loading, error, fetchData } = useFetch(`${BASE_URL}/users`);

  const handleChangeRole = async (userId, value) => {
    try {
      await updateData(`${BASE_URL}/users/${userId}`, 'role', value);
      fetchData(); // Call fetchData directly, no need to pass it as a parameter
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteData(`${BASE_URL}/users/${userId}`);
      fetchData(); // Call fetchData directly, no need to pass it as a parameter
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='data-box container-fluid pt-4'>
      <div className='row align-item-center justify-content-center'>
        <h1 className='dashboard-heading'>Users</h1>
        <h5 className='pt-5 mt-3 dashboard-text'>All Users</h5>
        <div className='col-12 table-box'>
        <table className="table tours-table shadow">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Id</th>
              <th scope="col">Image</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Orders</th>
              <th scope="col">Role</th>
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
              users?.map((user,index)=>(
            <tr key={user._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <td>{user._id}</td>
              <td><img src={user.photo || Avatar} className='profileimg img-fluid rounded-circle border border-2' style={{width:'60px', height:'60px' , objectFit:'cover'}} alt="profile-img"/></td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>3</td>
              <td>
              <select
                  className="form-select form-options"
                  value={user.role}
                  onChange={(e) => handleChangeRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className='text-center'>
                  <button className='btn btn-light action-btn' type="button" onClick={()=> handleDelete(user._id)}>
                    <i className="ri-delete-bin-line action-icon delete-icon"></i>
                  </button>
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

export default Users