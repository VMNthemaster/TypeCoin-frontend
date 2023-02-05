import React from 'react'
import { FaCarSide } from 'react-icons/fa'

const Car = ({ wpm, carMargin, color, playerNum, username, isCurrentPlayer }) => {
    // this is staying 0% only
  return (
    <div className="flex justify-between mt-4 items-center">
      <div className={`w-[80%] h-fit`}>
        <div style={{ marginLeft: carMargin[`${playerNum}`] }} className={`w-fit flex flex-col`}>
            <h2 className={`-mb-2 text-[#8ca298] text-[1.05rem] ${isCurrentPlayer ? 'font-semibold' : 'italic'}`}>{username} {isCurrentPlayer && '(You)'}</h2>
          <FaCarSide className="inline" size={42} color={color} />
        </div>
      </div>
      <h2>{wpm[`${playerNum}`]} wpm</h2>
    </div>
  )
}

export default Car
