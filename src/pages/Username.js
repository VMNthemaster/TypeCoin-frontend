import React, { useState } from 'react'
import { ethers } from 'ethers'
import { backgroundImageClasses } from '../utils'

const Username = () => {
  const [username, setUsername] = useState('')

  console.log({ username })
  const handleChange = (e) => {
    setUsername(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted', username)
  }
  return (
    <div
      className={`min-h-[90vh] flex my-auto items-center justify-center`}
      style={backgroundImageClasses}
    >
      <div className="w-[30vw] h-fit bg-gray-100 rounded-md p-4">
        <h2 className="text-center text-2xl text-blue-800">Enter Username</h2>
        <input
          className="mt-3 w-full h-[5vh] outline-none rounded-md p-2"
          name="username"
          value={username}
          onChange={handleChange}
          type="text"
        />
        <div className='flex justify-center mt-4'>
          <button
            className="bg-orange-600 text-white mx-auto p-2 rounded-md w-full"
            onClick={handleSubmit}
          >
            Go!
          </button>
        </div>
      </div>
    </div>
  )
}

export default Username
