import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
      <div className='w-[18%] min-h-screen bg-white border-r border-gray-200 shadow-sm'>
          <div className='flex flex-col gap-2 pt-8 px-4'>
              <h2 className='text-lg font-bold text-gray-800 mb-4 px-3'>Admin Panel</h2>
          
              <NavLink className='flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600' to={'/dashboard'}>
                  <img className='w-5 h-5' src={assets.dashboard} />
                  <p className='hidden md:block font-medium'>Dashboard</p>
              </NavLink>
              
              <NavLink className='flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600' to={'/doctorApplication'}>
                  <img className='w-5 h-5' src={assets.add_icon} />
                  <p className='hidden md:block font-medium'>Doctor Applications</p>
              </NavLink>
              
              <NavLink className='flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600' to={'/pharmacyApplication'}>
                  <img className='w-5 h-5' src={assets.add_icon} />
                  <p className='hidden md:block font-medium'>Pharmacy Applications</p>
              </NavLink>

          </div>
    </div>
  )
}

export default Sidebar