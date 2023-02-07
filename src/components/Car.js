import React from 'react'
import { FaCarSide } from 'react-icons/fa'

const Car = ({ wpm, carMargin, color, playerNum, username, isCurrentPlayer, rankings }) => {

  return (
    <div className="flex justify-between mt-4 items-center">
      <div className={`w-[80%] h-fit pr-[10%] pl-[1%]`}>
        <div style={{ marginLeft: carMargin[`${playerNum}`] }} className={`w-[80%] flex flex-col`}>
            <h2 className={`-mb-2 text-[#8ca298] text-[1.05rem] ${isCurrentPlayer ? 'font-semibold' : 'italic'}`}>{username} {isCurrentPlayer && '(You)'}</h2>
          <FaCarSide className="inline" size={42} color={color} />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
      <h2>{rankings[`${playerNum}`] && rankings[`${playerNum}`]}</h2>
      <h2>{wpm[`${playerNum}`]} wpm</h2>
      </div>
    </div>
  )
}

export default Car
