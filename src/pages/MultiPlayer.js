import Loading from '../components/Loading'
import React, { useEffect, useRef } from 'react'
import useState from 'react-usestateref'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStateContext } from '../context'
import { checkEndingOfSentence, getRandomNumbers } from '../utils'
import axios from 'axios'
import io from 'socket.io-client'
import Car from '../components/Car'
const socket = io.connect('http://localhost:5000')

const MultiPlayer = () => {
  let { room } = useParams()
  const { getSentences } = useStateContext()
  const navigate = useNavigate()
  const inputRef = useRef()
  const { state } = useLocation()

  const [roomData, setRoomData] = useState(undefined)
  const [sentenceData, setSentenceData, getSentenceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [counter, setCounter] = useState(4)
  const [currentPlayerNumber, setCurrentPlayerNumber] = useState('')

  const [carMargin, setCarMargin] = useState({
    player1: '0%',
    player2: '0%',
    player3: '0%',
  })
  const [wpm, setWpm] = useState({
    player1: 0,
    player2: 0,
    player3: 0,
  })

  const [inputText, setInputText, getInputText] = useState('')
  const [currentKeyPressed, setCurrentKeyPressed] = useState('')
  const [typedText, setTypedText] = useState('')
  const [incorrectTypedText, setIncorrectTypedText] = useState('')
  const [currentSentence, setCurrentSentence] = useState('')
  const [redColorText, setRedColorText] = useState('')
  // this one will be used to only make the text red which is wrong and not the whole sentence.

  const sendSentenceDataToBackend = async () => {
    const url = 'http://localhost:5000/getSentenceData'
    const res = await axios.post(url, {
      sentenceData: getSentenceData.current,
      roomId: room,
    })

    const data = await res.data
    return data
  }

  const getSentenceDataFromBackend = async () => {
    const url = 'http://localhost:5000/sendSentenceData'
    const res = await axios.post(url, {
      roomId: room,
    })

    const data = await res.data
    return data
  }

  const getSentencesFromSmartContract = async () => {
    const numArray = getRandomNumbers(1, state.roomData.numOfSentences, 1)

    const data = await getSentences(false, numArray) // false since multiplayer
    if (data.success) {
      const parsedData = checkEndingOfSentence(data.data)
      setSentenceData(parsedData[0])
    } else {
      getSentencesFromSmartContract()
    }

    // send the sentenceData to backend and other players joining the room will get data directly from there
    sendSentenceDataToBackend()
  }

  const joinRoom = () => {
    socket.emit('join_room', { roomId: room })
  }

  useEffect(() => {
    if (!loading) {
      handleCounter()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, loading])

  useEffect(() => {
    socket.on('set_loading_false', (data) => {
      if (data.roomId === room) {
        // at this point everybody has all data
        setCurrentSentence(getSentenceData.current.sentence)
        setLoading(false) // we can set it to false later as well
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (state === null) {
      navigate('/username')
      return
    }

    setRoomData(state.roomData)

    socket.connect()

    joinRoom()

    if (state.roomData.currentRoomCount === 1) {
      getSentencesFromSmartContract()
    } else {
      const asyncGetSentenceDataFromBackend = async () => {
        const data = await getSentenceDataFromBackend()
        setSentenceData(data)
        setCurrentPlayerNumber(
          Object.keys(state.roomData.usernames)[
            state.roomData.currentRoomCount - 1
          ]
        )
      }
      asyncGetSentenceDataFromBackend()
    }

    if (state.roomData.currentRoomCount === 3) {
      socket.emit('change_loading_state', { roomId: room })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCounter = async () => {
    setTimeout(() => {
      if (counter >= 0) {
        setCounter(counter - 1)
      }
    }, 1000)
  }

  // io functions
  const handleChange = (e) => {
    setInputText(e.target.value)
    console.log(getInputText.current)
  }

  return (
    <div
      className={`h-[90vh] bg-gradient-to-b from-gray-100 to-gray-200 w-full flex justify-center items-center`}
    >
      {loading && <Loading />}

      {!loading && (
        <div className="card h-fit w-[40%] p-4 border-2 bg-white shadow-md rounded-md">
          {/* heading */}
          <div className="flex justify-between">
            <h2 className="text-blue-500 text-lg font-semibold">
              {counter > 0
                ? 'The race is about to start...'
                : 'The race has started!'}
            </h2>
            {counter >= 0 && (
              <h2 className="text-lg font-semibold">: 0{counter}</h2>
            )}
          </div>

          {/* car, there will be three cars */}
          <div className="flex flex-col w-[100%]">
            {/* car 1 */}
            <Car
              wpm={wpm}
              carMargin={carMargin}
              color="orange"
              playerNum="player1"
            />
            <hr className="w-[80%] border-2 border-dashed border-red-400" />

            <Car
              wpm={wpm}
              carMargin={carMargin}
              color="brown"
              playerNum="player2"
            />
            <hr className="w-[80%] border-2 border-dashed border-red-400" />

            <Car
              wpm={wpm}
              carMargin={carMargin}
              color="purple"
              playerNum="player3"
            />
            <hr className="w-[80%] border-2 border-dashed border-red-400" />
          </div>

          {/* main menu */}
          <div
            onClick={() => navigate('/')}
            className="flex justify-start cursor-pointer mt-4"
          >
            <button className="bg-yellow-300 rounded-md hover:bg-yellow-400 text-blue-900 px-4 py-2">
              Main Menu
            </button>
          </div>

          {/* sentence and input */}
          <div className="w-full p-4 mt-4 border-2 border-blue-300 bg-blue-100 flex flex-col gap-y-4 rounded-md">
            <div className={`text-xl tracking-[0.085em]`}>
              <span className="text-green-500 text-xl tracking-[0.085em]">
                {typedText}
              </span>
              <span className="text-red-400 text-xl tracking-[0.085em]">
                {redColorText}
              </span>
              {currentSentence}
            </div>

            <input
              ref={inputRef}
              autoComplete="off"
              onKeyDown={(e) => setCurrentKeyPressed(e.key)}
              placeholder={`${
                counter <= 0 ? '' : 'Start typing when the race begins....'
              }`}
              onChange={handleChange}
              name="inputText"
              value={inputText}
              type="text"
              className={`w-full outline-none  rounded-md h-[5vh] p-2 text-lg ${
                counter <= 0 ? 'border-2 border-black' : ''
              }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiPlayer
