import React from 'react'
import { useEffect } from 'react'
import useState from 'react-usestateref'
import {FaCarSide} from 'react-icons/fa'
import {useStateContext} from '../context'
import Loading from '../components/Loading'

const SinglePlayer = () => {
    const {getSentences} = useStateContext()
    const [counter, setCounter] = useState(3)
    const [sentencesArray, setSentencesArray] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const handleCounter = () => {
        setTimeout(() => {
            if(counter >= 0){
                setCounter(counter - 1)
            }
        }, 1000);
    }

    // useEffect(() => {
    //     if(!isLoading){
    //         handleCounter()
    //     }
    
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [counter, isLoading])

    const getSentencesFromSmartContract = async () => {
        const data = await getSentences(true, [0,1,2])
        setSentencesArray(data)
        // true since bool is isSinglePlayer.
        // temporarily array is hardcoded we will get random numbers later.
    }

    useEffect(() => {
      getSentencesFromSmartContract()   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if(sentencesArray){
        setIsLoading(false)
      }
      if(!isLoading){
        handleCounter()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentencesArray])
    
    
    
    
  return (
    <div className='h-[90vh] bg-gray-200 w-full flex justify-center items-center'>
        {isLoading && <Loading /> }
        {!isLoading && <div className="card h-fit w-[40%] p-4 border-2 bg-white shadow-md rounded-md"> 
            <div className="flex justify-between">
                <h2 className='text-blue-500 text-lg font-semibold'>{counter > 0 ? 'The race is about to start...': 'The race has started!'}</h2>
                {counter >= 0 && <h2 className='text-lg font-semibold'>: 0{counter}</h2>}
            </div>
            <div className="flex justify-between mt-2 items-center">
                {/* here the dynamic car picture and wpm will come(wpm will be in the corner) */}
                <div className='w-[80%] flex flex-col'>
                    <FaCarSide size={42} color="purple" />
                    <hr className='border-2 border-dashed border-red-400' />
                </div>
                <h2>0 wpm</h2>
            </div>
                {sentencesArray && <h2>{sentencesArray[0]}</h2>}
        </div>}
    </div>
  )
}

export default SinglePlayer