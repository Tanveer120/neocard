import React from 'react'
import {assets} from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = ({setToken}) => {
  return (
      <div className='flex items-center py-2 px-[4%] justify-between border-none'>
          <Link to="/" className="text-2xl font-bold text-pink-600">
        Neo Health Card
      </Link>
          <button onClick={()=>setToken('')} className='bg-pink-600 text-white py-2 px-5 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar