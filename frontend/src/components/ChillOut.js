import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"

const ChillOut = () => {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [showButton, setShowButton] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const intervalId = setInterval(getTime, 1000)
    const timeoutId = setTimeout(() => setShowButton(true), 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  const getTime = () => {
    const accuTime = new Date()
    accuTime.setSeconds(accuTime.getSeconds() + 2)
    setDate(accuTime.toLocaleDateString())
    setTime(new Date().toLocaleTimeString())
  }

  const clockStyle = {
    fontFamily: 'Archivo Black, sans-serif',
    fontSize: "5rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    margin: "-8rem 0 0 -15rem",
  }

  return (
    <div className="d-flex">
      <div className="text-white text-center" style={clockStyle}>
        <div>{date}</div>
        <div>{time}</div>
        {showButton &&
          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate("/")}>Back To Work</button>
        }

      </div>
    </div>
  )
}

export default ChillOut