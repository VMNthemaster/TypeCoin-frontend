import React from 'react'
import {useNavigate} from 'react-router-dom'

const MultiPlayerLoser = ({setLoserScreen}) => {
    const navigate = useNavigate()
    return (
      <div className="w-[30vw] h-fit z-10 absolute bg-orange-500 p-4 border-2 shadow-md rounded-md flex flex-col justify-between items-center">
        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex justify-between w-full">
            <h1 className="text-3xl text-white font-serif font-bold">
              Hard luck
            </h1>
            <span onClick={() => setLoserScreen(false)} className='text-white font-bold cursor-pointer'>X</span>
          </div>
          <h2 className='text-xl text-white font-mono'>Better luck next time!</h2>
          
        </div>
        <div className="flex justify-between w-full cursor-pointer mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-300 rounded-md hover:bg-yellow-400 text-white font-medium px-4 py-2"
          >
            Main Menu
          </button>
          <button
            onClick={() => navigate('/username')}
            className="bg-green-500 rounded-md hover:bg-green-600 text-white font-medium px-4 py-2"
          >
            {/* work on this later */}
            New Race
          </button>
        </div>
      </div>
    )
}

export default MultiPlayerLoser