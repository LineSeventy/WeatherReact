import React from 'react'
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className='bg-blue-500 p-4 flex justify-between items-center'>
        <h1 className='text-white text-3xl font-bold'>Weather</h1>

      </div>
    </>
  )
}

export default Navbar
