import React, {useRef, useEffect} from 'react'
import useState from 'react-usestateref'
import { useLocation } from 'react-router-dom'
import { FaCarSide } from 'react-icons/fa'
import Loading from '../components/Loading'
import { useStateContext } from '../context'
import { checkEndingOfSentence, getRandomNumbers } from '../utils'

const SinglePlayer = () => {
  const {state} = useLocation()
  const { getSentences } = useStateContext()
  const [counter, setCounter] = useState(4)
  const [sentencesArray, setSentencesArray, getSentencesArray] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSentence, setCurrentSentence] = useState('')
  const [currentNumSentence, setCurrentNumSentence] = useState(0 % 3)
  const [inputText, setInputText, getInputText] = useState('')
  const [typedText, setTypedText, getTypedText] = useState('')
  const [incorrectTypedText, setIncorrectTypedText] = useState('')
  const [currentKeyPressed, setCurrentKeyPressed] = useState('') 
  console.log(currentKeyPressed)
  const ignoreKeyStrokes = ['Shift', 'Alt', 'Tab', 'Escape', 'CapsLock', 'Control', 'Meta', 'ContextMenu', 'Enter', 'F1', 'F2', 'F3','F4','F5','F6','F7','F8','F9','F10','F11','F12', 'Insert', 'End', 'PageUp', 'PageDown', 'Home', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

  const timeStamps = useRef({
    startTime: '',
    currentTime: '',
    endTime: '',
    currentWordCount: 0,
  })

  const handleInput = (e) => {
    if(ignoreKeyStrokes.includes(currentKeyPressed)) return;

    if(currentKeyPressed === 'Backspace'){
      if(incorrectTypedText.length > 0){
        setIncorrectTypedText(prevText => prevText.substring(0,incorrectTypedText.length-1))
      }
      else{
        setCurrentSentence(prevText => typedText.charAt(typedText.length - 1) + prevText)
        setTypedText(prevText => prevText.substring(0, prevText.length-1))  // removes last character from the string
      }

      return;
    }

    // checks if the key pressed is correct or not
    if(currentKeyPressed === currentSentence[0]){
      setTypedText(prevText => prevText + currentKeyPressed)
      setCurrentSentence(prevText => prevText.slice(1))
    }
    else{
      // only add it to the incorrect string if already typed incorrect list length is less than 5
      if(incorrectTypedText.length > 5){
        setInputText(prevText => prevText.substring(0, prevText.length-1) )
      }
      else{
        setIncorrectTypedText(prevText => prevText + currentKeyPressed)
      }
    }

  }

  const handleChange = (e) => {
    if(counter > 0) return;

    setInputText(e.target.value)

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
    console.log(numArray)

    const data = await getSentences(true, [3, 1, 2])
    if (data.success) {
      const parsedData = checkEndingOfSentence(data.data)
      setSentencesArray(parsedData)
      setCurrentSentence(parsedData[currentNumSentence].sentence)
      setIsLoading(false)
    } else {
      getSentencesFromSmartContract()
    }
    // true since bool is isSinglePlayer.
    // temporarily array is hardcoded we will get random numbers later.
  }

  useEffect(() => {
    getSentencesFromSmartContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (getSentencesArray.length > 0) {
      console.log('len>0')
      setIsLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentencesArray])

  useEffect(() => {
    if (!isLoading) {
      handleCounter()
    }
    if(counter === 0){
      timeStamps.current.startTime = new Date().getTime()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, isLoading])

  return (
    <div className="h-[90vh] bg-gray-200 w-full flex justify-center items-center">
      {isLoading && <Loading />}
      {!isLoading && (
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
            <div className={`w-[80%] grid grid-rows-1 grid-cols-${sentencesArray[currentNumSentence].count < 12 ? sentencesArray[currentNumSentence].count : '12'}`}>
                {/* col start number and col end number will be dynamically changed */}
              <FaCarSide className={`col-start-7 col-end-8 justify-self-center`} size={42} color="purple" />
            </div>
            <h2>0 wpm</h2>
          </div>
          <hr className="w-[80%] border-2 border-dashed border-red-400" />

          <div className='w-full p-4 mt-4 border-2 border-blue-300 bg-blue-100 flex flex-col gap-y-4 rounded-md'>
          {sentencesArray && (
            <div className='text-xl tracking-wide'><span className='text-green-500 text-xl tracking-wide'>{typedText}</span>{currentSentence}</div>
          )}
          <input autoComplete='off' onKeyDown={(e) => setCurrentKeyPressed(e.key) } placeholder={`${counter<=0 ? '' : 'Start typing when the race begins....'}`} onChange={handleChange} name="inputText" value={inputText} type="text" autoFocus className='w-full outline-none  rounded-md h-[5vh] p-2 text-lg' />
          </div>
        </div>
      )}
    </div>
  )
}

export default SinglePlayer
