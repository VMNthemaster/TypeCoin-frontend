import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({
  title,
  description,
  buttonText,
  colorObject,
  navigateTo,
  tabIndex,
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col my-auto ">
      <div>
        <h2 className={`${colorObject.title} text-2xl`}>{title}</h2>
      </div>
      <div>
        <p className={`${colorObject.title} text-[1rem]`}>{description}</p>
        <div className="mt-[3vh]">
          <button
            tabIndex={tabIndex}
            onClick={() => navigate(navigateTo)}
            className={`text-white ${colorObject.buttonColor} px-[1.25rem] py-[0.75rem] rounded-md clickEffect focus:outline-none focus:font-bold`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
