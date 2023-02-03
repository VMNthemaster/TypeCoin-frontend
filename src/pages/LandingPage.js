import React from 'react'
import Card from '../components/Card'
import { backgroundImageClasses } from '../utils'
import { useStateContext } from '../context'
import { useEffect } from 'react'
import { useState } from 'react'

const LandingPage = () => {
  const { getTotalNumberOfSentences } = useStateContext()
  const [numOfSentences, setNumOfSentences] = useState(1)

  const getTotalNumberOfSentencesFromSmartContract = async () => {
    const data = await getTotalNumberOfSentences()
    if (data.success) {
      setNumOfSentences(Number(data.num._hex))
    }
  }

  useEffect(() => {
    getTotalNumberOfSentencesFromSmartContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cardDivStyles = 'bg-gray-100 rounded-md p-[1rem] h-fit w-fit'
  return (
    <div
      className={`min-h-[90vh] flex my-auto gap-x-[5vw] items-center justify-center`}
      style={backgroundImageClasses}
    >
      <div className={cardDivStyles}>
        <Card
          numOfSentences={numOfSentences}
          title="Typing Test"
          description="Improve your typing skills on your own"
          buttonText="Practice Yourself"
          colorObject={{ title: 'text-blue-800', buttonColor: 'bg-blue-800' }}
          navigateTo="/single"
          tabIndex={1}
        />
      </div>
      <div className={cardDivStyles}>
        <Card
          numOfSentences={numOfSentences}
          title="Race your friends"
          description="Race with your friends and win ethereum"
          buttonText="Enter a typing race"
          colorObject={{ title: 'text-blue-800', buttonColor: 'bg-orange-600' }}
          navigateTo="/username"
          tabIndex={2}
        />
      </div>
    </div>
  )
}

export default LandingPage
