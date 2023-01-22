import React from 'react'
import {useStateContext} from '../context'
import { showAddress } from '../utils'

const Navbar = () => {
  const {address, connect} = useStateContext()

  const handleClick = () => {
    if(!address){
      connect()
    }
  }
  return (
    <div className='h-[10vh] w-full bg-orange-400 flex justify-center items-center '>
        <button onClick={handleClick} className='h-[80%] w-fit px-[2rem] text-lg rounded-md bg-orange-500 text-white clickEffect'>{address? `Address: ${showAddress(address)}` : 'Connect Metamask Wallet'}</button>
    </div>
  )
}

export default Navbar