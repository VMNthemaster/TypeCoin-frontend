import React from 'react'
import { useNavigate } from 'react-router-dom'


const SinglePlayerResult = ({timeStamps, wpm, handleTryAgain, handleNewRace }) => {
  const navigate = useNavigate()

  return (
    <div className="w-[40%] p-4 border-2 bg-white shadow-md rounded-md">
      <div className="flex justify-start">
        <h2 className="text-blue-500 text-lg font-semibold">
          The race has ended!
        </h2>
      </div>
      <div className="bg-blue-500 p-2 mt-4 rounded-md py-4">
        <div className="grid grid-rows-2 grid-cols-2 h-fit">
            <div className="speed justify-self-center text-gray-200">Your speed: </div>
            <div className="speed-value justify-self-center text-white font-bold text-lg">{wpm} wpm</div>
            <div className="time justify-self-center text-gray-200">Time taken: </div>
            <div className="time-value justify-self-center text-white font-bold text-lg">{(timeStamps.endTime - timeStamps.startTime)/1000} sec</div>
        </div>
        <div className="buttons flex justify-around p-2 mt-2">
            <div onClick={handleTryAgain} className='bg-yellow-300 rounded-md py-2 px-4 cursor-pointer hover:bg-yellow-400'><button className='text-blue-900'>Try again</button></div>
            <div onClick={handleNewRace} className='bg-yellow-300 rounded-md py-2 px-4 cursor-pointer hover:bg-yellow-400'><button className='text-blue-900'>New Race</button></div>
            <div onClick={() => navigate('/')} className='bg-yellow-300 rounded-md py-2 px-4 cursor-pointer hover:bg-yellow-400'><button className='text-blue-900'>Main Menu</button></div>
        </div>
      </div>
    </div>
  )
}

export default SinglePlayerResult
