import {useEffect, useState} from "react"
import useAuth from "../../hooks/useAuth"
import useDecodeToken from "../../hooks/useDecodeToken"
import RefreshIcon from "./RefreshIcon"

const Timer = () => {
  const [time, setTime] = useState(0)
  const {auth} = useAuth()
  const decodeToken = useDecodeToken()


  useEffect(() => {
    const timeoutId = setTimeout(calculateTime, 1000)
    return () => clearTimeout(timeoutId)
  }, [time])

  const calculateTime = () => {
    const now = new Date().getTime()
    const exp = decodeToken(auth?.accessToken)?.exp * 1000
    setTime(Math.round((exp - now) / 1000))
  }

  const displayTime = () => {
    const absTime = Math.abs(time)
    return `${Math.floor(absTime / 60).toString().padStart(2, '0')} : ${(absTime % 60).toString().padStart(2, '0')}`
  }

  return (
    <>
      <div>
        <span className="text-white">Access Token</span>
        <span className={`text-${time >= 0 ? 'white' : 'danger'} mx-2`}>{displayTime()}</span>
        <RefreshIcon/>
      </div>
    </>
  )
}

export default Timer