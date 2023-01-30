import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useState from 'react-usestateref'

const MultiPlayer = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [roomData, setRoomData] = useState(undefined)

  useEffect(() => {
    if (state === null) {
      navigate('/username')
      return;
    }

    setRoomData(state.roomData)

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
            {roomData.usernames.map((user, id) => (
              <h2 key={id}>{user}</h2>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MultiPlayer
