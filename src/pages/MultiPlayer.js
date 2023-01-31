import React, { useEffect } from 'react'
import useState from 'react-usestateref'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStateContext } from '../context'
import io from 'socket.io-client'
import { checkEndingOfSentence, getRandomNumbers } from '../utils'
const socket = io.connect('http://localhost:5000')

const MultiPlayer = () => {
  const {getSentences} = useStateContext()
  const navigate = useNavigate()
  const { state } = useLocation()
  console.log(state)
  const [roomData, setRoomData] = useState(undefined)
  const [sentenceData, setSentenceData] = useState({})

  const notifyRoomIsFull = () => {
    socket.emit('get_sentence_from_first_player')
  }

  const sendSentenceDataToRoom = (parsedData) => {
    socket.emit('send_sentence_to_room', {parsedData})
  }

  const getSentencesFromSmartContract = async () => {
    const numArray = getRandomNumbers(1,state.roomData.numOfSentences, 1)

    const data = await getSentences(false, numArray)  // false since multiplayer
    if(data.success){
      const parsedData = checkEndingOfSentence(data.data)
      console.log(parsedData)
      sendSentenceDataToRoom(parsedData[0])

    }
    else{
      getSentencesFromSmartContract()
    }
  }

  useEffect(() => {
    if (state === null) {
      navigate('/username')
      return;
    }

    setRoomData(state.roomData)

    if(state.roomData.currentRoomCount === 1){
      getSentencesFromSmartContract()
    }

    if(state.roomData.playState){
      notifyRoomIsFull()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`h-[90vh]`}>
      { roomData && (
        <>
          <div>{roomData.roomId}</div>
          <div>{roomData.currentRoomCount}</div>
          <div>{roomData.playState === false ? 'false' : 'true'}</div>
          <div>
            {roomData.usernames.map((user, id) => (
              <h2 key={id}>{user}</h2>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MultiPlayer
