import React from 'react'
import AdminRouters from '../../router/AdminRouters'

const AdminLayout = () => {
  return (
    <div>
        <Sidebar/>
        <AdminRouters/>
    </div>
  )
}

export default AdminLayout