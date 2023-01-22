import React from 'react'
import LoadingImg from '../assets/loading.png'

const Loading = () => {
  return (
    <div className='rotating'>
      <img src={LoadingImg} alt="loading..." />
    </div>
  )
}

export default Loading