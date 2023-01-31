import React, { useEffect } from 'react'
import useState from 'react-usestateref'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStateContext } from '../context'
import io from 'socket.io-client'
import { checkEndingOfSentence, getRandomNumbers } from '../utils'
const socket = io.connect('http://localhost:5000')

const MultiPlayer = () => {
  let { room } = useParams()
  const {getSentences} = useStateContext()
  const navigate = useNavigate()
  const { state } = useLocation()
  console.log(state)
  const [roomData, setRoomData] = useState(undefined)
  const [sentenceData, setSentenceData, getSentenceData] = useState({})

  const notifyRoomIsFull = () => {
    console.log("notify")
    socket.emit('get_sentence_from_first_player', {roomId: state.roomData.roomId})
  }

  const sendSentenceDataToRoom = (parsedData) => {
    socket.emit('send_sentence_to_room', {...parsedData, roomId: state.roomData.roomId})
  }

  const getSentencesFromSmartContract = async () => {
    const numArray = getRandomNumbers(1,state.roomData.numOfSentences, 1)

    const data = await getSentences(false, numArray)  // false since multiplayer
    if(data.success){
      const parsedData = checkEndingOfSentence(data.data)
      console.log(parsedData)
      setSentenceData(parsedData[0])
    }
    else{
      getSentencesFromSmartContract()
    }
  }

  const joinRoom = () => {
    socket.on("join_room", {roomId: room})
  }

  useEffect(() => {
    socket.on('get_sentence_from_first_player_backend', () => {
      console.log("reached here")
      console.log(state)
      if(state.roomData.currentRoomCount === 1){
        console.log("player1")
        sendSentenceDataToRoom(getSentenceData.current)
      }
    })

    socket.on('send_sentence_to_room_backend', (data) => {
      setSentenceData(data)
      console.log("sentence reached to everyone")
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])
  

  useEffect(() => {
    if (state === null) {
      navigate('/username')
      return;
    }

    setRoomData(state.roomData)

    joinRoom()

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
            {roomData.usernames.player1}
            {roomData.usernames.player2}
            {roomData.usernames.player3}
          </div>
        </>
      )}
    </div>
  )
}

export default MultiPlayer
