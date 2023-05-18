import {Link, useLocation, useNavigate} from "react-router-dom"
import FormBody from "./AuthForms/AuthFormPartials/FormBody"
import React, {useEffect, useState} from "react"
import AlertElement from "./Partials/AlertElement"

const Missing = () => {
  const [show, setShow] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const buttonGroupStyle = "mt-4 d-flex justify-content-around"
  const buttonStyle = "btn btn-outline-light"
  const navigate = useNavigate()
  const location = useLocation()

  const handleEsc = (e) => {
    if (e.key === 'Escape') navigate(-1)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 100)
    location?.state?.infoMsg && setErrMsg(location.state.infoMsg)
    window.addEventListener('keydown', handleEsc)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <>
      <div className={`missing ${show && 'show'}`}>
        <FormBody>
          <img src="/404.jpg" alt="404 Not Found" style={{width: "100%"}}/>
          <div className={buttonGroupStyle}>
            <Link to="/" className={buttonStyle}>Homepage</Link>
            <Link to="/chill" className={buttonStyle}>Just Chill</Link>
          </div>
        </FormBody>
      </div>
      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg} fullScreen={true}/>
    </>
  )
}

export default Missing
