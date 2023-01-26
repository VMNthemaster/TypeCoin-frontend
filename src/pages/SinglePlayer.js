import React, { useEffect, useRef } from 'react'
import useState from 'react-usestateref'
import { useLocation } from 'react-router-dom'
import { FaCarSide } from 'react-icons/fa'
import Loading from '../components/Loading'
import { useStateContext } from '../context'
import { checkEndingOfSentence, getRandomNumbers, checkIgnoredKey } from '../utils'
import SinglePlayerResult from '../components/SinglePlayerResult'

const SinglePlayer = () => {
  const { state } = useLocation()
  const { getSentences } = useStateContext()
  const inputRef = useRef()

  const [counter, setCounter] = useState(4)
  const [sentencesArray, setSentencesArray, getSentencesArray] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSentence, setCurrentSentence] = useState('')
  const [currentNumSentence, setCurrentNumSentence] = useState(0 % 3)
  const [inputText, setInputText, getInputText] = useState('')
  const [typedText, setTypedText] = useState('')
  const [incorrectTypedText, setIncorrectTypedText, getIncorrectTypedText] = useState('')
  const [currentKeyPressed, setCurrentKeyPressed] = useState('')
  const [wpm, setWpm] = useState(0)
  const [timeStamps, setTimeStamps] = useState({
    startTime: '',
    currentTime: '',
    endTime: '',
    currentWordCount: 0,
  })
  const [showResult, setShowResult] = useState(false)



  const calculateWPM = () => {
    const numOfWords = timeStamps.currentWordCount
    const timePassed = (timeStamps.currentTime - timeStamps.startTime)/ (60 * 1000) 
    // 60 to convert it in minutes and 1000 to convert from millseconsds to seconds
    const tempWPM = Math.floor(numOfWords / timePassed)
    setWpm(tempWPM)
  }

  const handleInput = (e) => {
    if (checkIgnoredKey(currentKeyPressed)) return

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
      timeStamps.currentWordCount ===
        sentencesArray[currentNumSentence].count - 1 &&
      getInputText.current === sentencesArray[currentNumSentence].lastWord
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

  const handleChange = (e) => {
    if (counter > 0) return
    if (
      timeStamps.currentWordCount === sentencesArray[currentNumSentence].count
    )
      return

    if (currentKeyPressed === ' ') {
      // if space is clicked when it should not have been clicked
      if(getIncorrectTypedText.current.length === 0 && currentSentence[0] !== ' '){
        setIncorrectTypedText(' ')
        setInputText(e.target.value)
        return;
      }
      
      // if space clicked clear input field for correct typing
      if (incorrectTypedText.length === 0) {
        timeStamps.currentWordCount += 1
        timeStamps.currentTime = new Date().getTime()
        setInputText('')
      } else {
        setInputText(e.target.value)
      }

      calculateWPM()
      
    } else {
      setInputText(e.target.value)
    }

    handleInput(e)
  }

  const handleCounter = () => {
    setTimeout(() => {
      if (counter >= 0) {
        setCounter(counter - 1)
      }
    }, 1000)
  }

  const getSentencesFromSmartContract = async () => {
    const numArray = getRandomNumbers(1, state.numOfSentences, 3)

    const data = await getSentences(true, [0, 1, 2])
    if (data.success) {
      const parsedData = checkEndingOfSentence(data.data)
      setSentencesArray(parsedData)
      // console.log(getSentencesArray.current)
      setCurrentSentence(parsedData[currentNumSentence].sentence)
      setIsLoading(false)
    } else {
      getSentencesFromSmartContract()
    }
  }


  useEffect(() => {
    getSentencesFromSmartContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (getSentencesArray.length > 0) {
      setIsLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentencesArray])

  useEffect(() => {
    if (!isLoading) {
      handleCounter()
    }
    if (counter === 0) {
      timeStamps.startTime = new Date().getTime()
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, isLoading])

  return (
    <div className="h-[90vh] bg-gray-200 w-full flex justify-center items-center">
      {isLoading && <Loading />}
      {!isLoading && !showResult && (
        <div className="card h-fit w-[40%] p-4 border-2 bg-white shadow-md rounded-md">
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
          <div className="flex justify-between mt-2 items-center">
            {/* here the dynamic car picture and wpm will come(wpm will be in the corner) */}
            <div
              className={`w-[80%] grid grid-rows-1 grid-cols-${
                sentencesArray[currentNumSentence].count < 12
                  ? sentencesArray[currentNumSentence].count
                  : '12'
              }`}
            >
              {/* col start number and col end number will be dynamically changed */}
              <FaCarSide
                className={`col-start-7 col-end-8 justify-self-center`}
                size={42}
                color="purple"
              />
            </div>
            <h2>{wpm} wpm</h2>
          </div>
          <hr className="w-[80%] border-2 border-dashed border-red-400" />

          <div className="w-full p-4 mt-4 border-2 border-blue-300 bg-blue-100 flex flex-col gap-y-4 rounded-md">
            {sentencesArray && (
              <div
                className={`text-xl tracking-[0.085em] ${
                  incorrectTypedText.length > 0 ? 'text-red-400' : ''
                }`}
              >
                <span className="text-green-500 text-xl tracking-[0.085em]">
                  {typedText}
                </span>
                {currentSentence}
              </div>
            )}
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
              // autoFocus
              className="w-full outline-none  rounded-md h-[5vh] p-2 text-lg"
            />
          </div>
        </div>
      )}
      {!isLoading && showResult && (
        <SinglePlayerResult timeStamps={timeStamps} wpm={wpm} />
      )}
    </div>
  )
}

export default SinglePlayer
