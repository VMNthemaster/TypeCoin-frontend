import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { backgroundImageClasses } from '../utils'
import ProcessingImage from '../assets/processing.png'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000')

const Username = () => {
  const { sendParticipationAmount, address } = useStateContext()
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [hideButton, setHideButton] = useState(false)

  const tempFunc = () => {
    socket.emit('send_message', {msg: 'Sent hello'})
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.msg)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])
  

  const handleChange = (e) => {
    setUsername(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username === '') return

    setHideButton(true)
    setMessage('Processing transaction....')

    // first check if metamask wallet is connected or not
    if (address) {
      const data = await sendParticipationAmount()
      console.log(data)
      if (data.success) {
        // navigate to racing page
      } else {
        setMessage('Transaction failed....Please try again')
        setHideButton(false)

        setTimeout(() => {
          setMessage('')
        }, 3000);
      }
    } else {
      setMessage('Connect to metamask wallet to process transaction....')
      setHideButton(false)
      setTimeout(() => {
        setMessage('')
      }, 3000);
    }
  }

  return (
    <div
      className={`min-h-[90vh] flex my-auto items-center justify-center`}
      style={backgroundImageClasses}
    >
      <div className="w-[30vw] h-fit bg-gray-100 rounded-lg px-8 pt-6 pb-10">
        <h2 className="text-center text-2xl text-blue-800">Enter Username</h2>
        <input
          className="mt-3 w-full h-[5.5vh] outline-none rounded-md p-2 focus:border-[2.5px] focus:border-orange-400"
          name="username"
          value={username}
          onChange={handleChange}
          type="text"
        />
        {/* submit button */}
        <div className="flex justify-center mt-4">
          {!hideButton && (
            <button
              className="bg-orange-600 text-white mx-auto p-2 rounded-md w-full clickEffect"
              onClick={handleSubmit}
            >
              Go!
            </button>
          )}
          {hideButton && (
            <div className=''>
              <img className='rotating' src={ProcessingImage} style={{width: '3vh', height: '3vh'}} alt="loading..." />
            </div>
          )}
        </div>
        {/* mesages */}
        {message && (
          <div className="w-[100%] h-fit mt-4 flex justify-center p-2 rounded-md text-blue-900">
            <h2 className="text-lg">{message}</h2>
          </div>
        )}
      </div>

      <button onClick={tempFunc}>Send hello</button>
    </div>
  )
}

export default Username
