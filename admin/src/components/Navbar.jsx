import React from 'react'
import {assets} from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = ({setToken}) => {
  return (
      <div className='flex items-center py-4 px-6 justify-between bg-white shadow-sm border-b border-gray-200'>
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
        Neo Health Card - Admin
      </Link>
          <button onClick={()=>setToken('')} className='bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md'>Logout</button>
    </div>
  )
}

export default Navbar