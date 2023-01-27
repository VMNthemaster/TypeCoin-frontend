import React from 'react'
import {useStateContext} from '../context'
import { showAddress } from '../utils'
import MetaMaskLogo from '../assets/metamask.png'

const Navbar = () => {
  const {address, connect} = useStateContext()

  const handleClick = () => {
    if(!address){
      connect()
    }
  }
  return (
    <div className='h-[10vh] w-full bg-blue-800 flex justify-center items-center '>
        <div onClick={handleClick} className='h-[80%] w-fit  text-lg rounded-md bg-blue-500 text-white clickEffect'>
          {address && (
            <div className='flex w-fit justify-start h-[100%] items-center pr-[2rem]'>
            <img className='h-[100%]' src={MetaMaskLogo} alt="metamask logo" />
            <h2>{`${showAddress(address)}`}</h2>
            </div>
          )}
          {!address && <h2 className='px-[2rem]'>Connect Metamask wallet</h2>}
        </div>
    </div>
  )
}

export default Navbar