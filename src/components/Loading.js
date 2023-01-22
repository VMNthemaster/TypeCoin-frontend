import React from 'react'
import LoadingImg from '../assets/loading.png'

const Loading = () => {
  return (
    <div className='rotating'>
      <img style={{width: '15vw', height: '15vw'}} src={LoadingImg} alt="loading..." />
    </div>
  )
}

export default Loading