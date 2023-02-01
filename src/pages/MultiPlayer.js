import React, { useEffect } from 'react'
import useState from 'react-usestateref'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStateContext } from '../context'
import { checkEndingOfSentence, getRandomNumbers } from '../utils'
import axios from 'axios'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000')

const MultiPlayer = () => {
  let { room } = useParams()
  const {getSentences} = useStateContext()
  const navigate = useNavigate()
  const { state } = useLocation()
  // console.log(state)
  const [roomData, setRoomData] = useState(undefined)
  const [sentenceData, setSentenceData, getSentenceData] = useState({})


  const sendSentenceDataToBackend = async () => {
    const url = 'http://localhost:5000/getSentenceData'
    const res = await axios.post(url, {
      sentenceData: getSentenceData.current,
      roomId: room,
    })

    const data = await res.data
    return data;
  }

  const getSentenceDataFromBackend = async () => {
    const url = 'http://localhost:5000/sendSentenceData'
    const res = await axios.post(url, {
      roomId: room,
    })

    const data = await res.data
    return data;
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

    // send the sentenceData to backend and other players joining the room will get data directly from there
    sendSentenceDataToBackend()
  }

  const joinRoom = () => {
    socket.emit("join_room", {roomId: room})
  }

  useEffect(() => {
    console.log("socket")

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
    else{
      const asyncGetSentenceDataFromBackend = async () => {
        const data = await getSentenceDataFromBackend()
        console.log(data)
        setSentenceData(data)
      }
      asyncGetSentenceDataFromBackend()
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
          {sentenceData && <div>{sentenceData.sentence}</div>}  
        </>
      )}
    </div>
  )
}

export default MultiPlayer
