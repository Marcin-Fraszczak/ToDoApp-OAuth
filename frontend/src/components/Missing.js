import React, {useEffect, useState} from "react"
import {Link, useLocation} from "react-router-dom"
import useHandleEsc from "../hooks/useHandleEsc"
import FormBody from "./Forms/FormsPartials/FormBody"
import AlertElement from "./Partials/AlertElement"

const Missing = () => {
  const [show, setShow] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const buttonGroupStyle = "mt-4 d-flex justify-content-around"
  const buttonStyle = "btn btn-outline-light"
  const location = useLocation()
  const handleEsc = useHandleEsc(-1)

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 100)
    location?.state?.infoMsg && setErrMsg(location.state.infoMsg)
    window.addEventListener('keydown', handleEsc)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('keydown', handleEsc)
    }
    // eslint-disable-next-line
  }, [location?.state?.infoMsg])

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
