import React from 'react'
import Card from '../components/Card'
import {backgroundImageClasses} from '../utils'

const LandingPage = () => {
  const cardDivStyles = 'bg-gray-100 rounded-md p-[1rem] h-fit w-fit'
  return (
    <div className={`min-h-[90vh] flex my-auto gap-x-[5vw] items-center justify-center`} style={backgroundImageClasses}>
      <div className={cardDivStyles}>
        <Card title='Typing Test' description='Improve your typing skills on your own' buttonText='Practice Yourself' colorObject={{title: 'text-blue-800', buttonColor: 'bg-blue-800'}} navigateTo='/single' />
      </div>
      <div className={cardDivStyles}>
        <Card title='Race your friends' description='Race with your friends and win ethereum' buttonText='Enter a typing race' colorObject={{title: 'text-blue-800', buttonColor: 'bg-orange-600'}} navigateTo='/username' />
      </div>
    </div>
  )
}

export default LandingPage