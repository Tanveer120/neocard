import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
      <div className='w-[18%] min-h-screen border-r-2 border-gray-300'>
          <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] border-gray-300'>
          
              <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to={'/dashboard'}>
                  <img className='w-5 h-5' src={assets.dashboard} />
                  <p className='hidden md:block'>Dashboarddd</p>
              </NavLink>
              
              <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to={'/doctorApplication'}>
                  <img className='w-5 h-5' src={assets.add_icon} />
                  <p className='hidden md:block'>Doctor Application</p>
              </NavLink>

          </div>
    </div>
  )
}

export default Sidebar