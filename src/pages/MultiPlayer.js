import Loading from '../components/Loading'
import React, { useEffect, useRef } from 'react'
import useState from 'react-usestateref'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStateContext } from '../context'
import {
  checkEndingOfSentence,
  checkIgnoredKey,
  getRandomNumbers,
} from '../utils'
import axios from 'axios'
import io from 'socket.io-client'
import Car from '../components/Car'
const socket = io.connect('http://localhost:5000')

const MultiPlayer = () => {
  let { room } = useParams()
  const { getSentences, getTotalNumberOfSentences } = useStateContext()
  const navigate = useNavigate()
  const inputRef = useRef()
  const { state } = useLocation()

  const [, setNumOfSentences, getNumOfSentences] = useState(1)
  const [roomData, setRoomData] = useState({})
  const [sentenceData, setSentenceData, getSentenceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [counter, setCounter] = useState(4)
  const [currentPlayerNumber, setCurrentPlayerNumber] = useState('')
  const [showResult, setShowResult] = useState(false)

  const [carMargin, setCarMargin, getCarMargin] = useState({
    player1: '0%',
    player2: '0%',
    player3: '0%',
  })
  const [wpm, setWpm] = useState({
    player1: 0,
    player2: 0,
    player3: 0,
  })
  const [timeStamps, setTimeStamps] = useState({
    startTime: '',
    currentTime: '',
    endTime: '',
    currentWordCount: 0,
  })

  const [inputText, setInputText, getInputText] = useState('')
  const [currentKeyPressed, setCurrentKeyPressed] = useState('')
  const [typedText, setTypedText] = useState('')
  const [incorrectTypedText, setIncorrectTypedText, getIncorrectTypedText] =
    useState('')
  const [currentSentence, setCurrentSentence, getCurrentSentence] = useState('')
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
    const num = await getTotalNumberOfSentences()
    setNumOfSentences(Number(num.num._hex))
    const numArray = getRandomNumbers(1, getNumOfSentences.current, 1)

    const data = await getSentences(false, numArray) // false since multiplayer
    if (data.success) {
      const parsedData = checkEndingOfSentence(data.data)
      setSentenceData(parsedData[0])
      setCurrentSentence(getSentenceData.current.sentence)
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

    if (counter === 0) {
      timeStamps.startTime = new Date().getTime()
      inputRef.current.focus()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, loading])

  useEffect(() => {
    socket.on('set_loading_false', (data) => {
      if (data.roomId === room) {
        // at this point everybody has all data
        setLoading(false) // we can set it to false later as well
        setRoomData(data.roomData)
      }
    })

    socket.on('receive_race_data', (data) => {
      console.log(data)
      if (data.roomId !== room) return

      setCarMargin((prevMargin) => {
        return {
          ...data.carMargin,
          [`${currentPlayerNumber}`]: prevMargin[`${currentPlayerNumber}`],
        }
      })

      setWpm((prevWpm) => {
        return {
          ...data.wpm,
          [`${currentPlayerNumber}`]: prevWpm[`${currentPlayerNumber}`],
        }
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (currentKeyPressed === 'Backspace') {
      const slicedText = redColorText.slice(redColorText.length - 1)
      setRedColorText((prevText) =>
        prevText.substring(0, redColorText.length - 1)
      )
      setCurrentSentence((prevText) => slicedText + prevText)
      return
    }

    const slicedText = currentSentence.slice(0, 1)
    setRedColorText((prev) => prev + slicedText)
    setCurrentSentence(currentSentence.slice(1))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incorrectTypedText])

  useEffect(() => {
    if (state === null) {
      navigate('/username')
      return
    }

    socket.connect()

    joinRoom()

    if (state.roomData.currentRoomCount === 1) {
      getSentencesFromSmartContract()
      setCurrentPlayerNumber('player1')
    } else {
      const asyncGetSentenceDataFromBackend = async () => {
        const data = await getSentenceDataFromBackend()
        setSentenceData(data)
        setCurrentSentence(getSentenceData.current.sentence)
        setCurrentPlayerNumber(
          Object.keys(state.roomData.usernames)[
            state.roomData.currentRoomCount - 1
          ]
        )
      }
      asyncGetSentenceDataFromBackend()
    }

    if (state.roomData.currentRoomCount === 3) {
      socket.emit('change_loading_state', {
        roomId: room,
        roomData: state.roomData,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendRaceData = () => {
    socket.emit('send_race_data', {
      roomId: room,
      carMargin,
      wpm,
    })
  }

  const calculateWPM = () => {
    const numOfWords = timeStamps.currentWordCount
    const timePassed =
      (timeStamps.currentTime - timeStamps.startTime) / (60 * 1000)
    // 60 to convert it in minutes and 1000 to convert from millseconsds to seconds
    const tempWPM = Math.floor(numOfWords / timePassed)
    setWpm((prevWPM) => {
      return {
        ...prevWPM,
        [`${currentPlayerNumber}`]: tempWPM,
      }
    })
  }

  const handleCounter = async () => {
    setTimeout(() => {
      if (counter >= 0) {
        setCounter(counter - 1)
      }
    }, 1000)
  }

  // io functions
  const handleChange = (e) => {
    if (counter > 0) return
    if (timeStamps.currentWordCount === sentenceData.count) return // send socket emit of race finished here

    if (currentKeyPressed === ' ') {
      // if space is clicked when it should not have been clicked
      if (
        getIncorrectTypedText.current.length === 0 &&
        currentSentence[0] !== ' '
      ) {
        setIncorrectTypedText(' ')
        setInputText(e.target.value)
        return
      }

      // if space clicked clear input field for correct typing
      if (incorrectTypedText.length === 0) {
        timeStamps.currentWordCount += 1
        timeStamps.currentTime = new Date().getTime()

        setCarMargin((prevMargin) => {
          return {
            ...prevMargin,
            [`${currentPlayerNumber}`]: `${Math.floor(
              (timeStamps.currentWordCount * 100) / sentenceData.count
            )}%`,
          }
        })
        setInputText('')

        if (timeStamps.currentWordCount % 3 === 0) {
          sendRaceData()
        }
      } else {
        setInputText(e.target.value)
      }

      calculateWPM()
    } else {
      setInputText(e.target.value)
    }

    handleInput(e)
  }

  const handleInput = () => {
    if (checkIgnoredKey(currentKeyPressed)) return

    // backspace
    if (currentKeyPressed === 'Backspace') {
      if (incorrectTypedText.length > 0) {
        setIncorrectTypedText((prevText) =>
          prevText.substring(0, incorrectTypedText.length - 1)
        )
      } else {
        setCurrentSentence(
          (prevText) => typedText.charAt(typedText.length - 1) + prevText
        )
        setTypedText((prevText) => prevText.substring(0, prevText.length - 1)) // removes last character from the string
      }

      return
    }

    // checks if the key pressed is correct or not
    if (currentKeyPressed === currentSentence[0]) {
      // if word is incorrect but the next letter is correct case
      if (getIncorrectTypedText.current.length > 0) {
        if (getIncorrectTypedText.current.length > 5) {
          setInputText((prevText) => prevText.substring(0, prevText.length - 1))
        } else {
          setIncorrectTypedText((prevText) => prevText + currentKeyPressed)
        }

        return
      }

      setTypedText((prevText) => prevText + currentKeyPressed)
      setCurrentSentence((prevText) => prevText.slice(1))
    } else {
      // only add it to the incorrect string if already typed incorrect list length is less than 5
      if (incorrectTypedText.length > 5) {
        setInputText((prevText) => prevText.substring(0, prevText.length - 1))
      } else {
        setIncorrectTypedText((prevText) => prevText + currentKeyPressed)
      }
    }

    // handling last word
    if (
      timeStamps.currentWordCount === sentenceData.count - 1 &&
      getInputText.current === sentenceData.lastWord
    ) {
      timeStamps.currentWordCount += 1
      timeStamps.currentTime = new Date().getTime()
      timeStamps.endTime = timeStamps.currentTime
      setInputText('')
      inputRef.current.blur() // removes focus when finished typing
      calculateWPM()
      setShowResult(true)
    }
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
              carMargin={getCarMargin.current}
              color="orange"
              playerNum="player1"
              username={roomData.usernames['player1']}
              isCurrentPlayer={currentPlayerNumber === 'player1'}
            />
            <hr className="w-[80%] border-2 border-dashed border-red-400" />

            <Car
              wpm={wpm}
              carMargin={carMargin}
              color="brown"
              playerNum="player2"
              username={roomData.usernames['player2']}
              isCurrentPlayer={currentPlayerNumber === 'player2'}
            />
            <hr className="w-[80%] border-2 border-dashed border-red-400" />

            <Car
              wpm={wpm}
              carMargin={carMargin}
              color="purple"
              playerNum="player3"
              username={roomData.usernames['player3']}
              isCurrentPlayer={currentPlayerNumber === 'player3'}
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
              <span className="bg-red-300 text-xl tracking-[0.085em]">
                {redColorText}
              </span>
              {getCurrentSentence.current}
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
              } ${incorrectTypedText.length > 0 ? 'bg-red-300' : ''}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiPlayer
