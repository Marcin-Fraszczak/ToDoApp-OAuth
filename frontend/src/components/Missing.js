import {Link} from "react-router-dom"
import FormBody from "./AuthForms/AuthFormPartials/FormBody"
import {useEffect, useState} from "react"

const Missing = () => {
  const [show, setShow] = useState(false)
  const buttonGroupStyle = "mt-4 d-flex justify-content-around"
  const buttonStyle = "btn btn-outline-light"

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className={`missing ${show && 'show'}`}>
      <FormBody>
        <img src="/404.jpg" alt="404 Not Found" style={{width: "100%"}}/>
        <div className={buttonGroupStyle}>
          <Link to="/" className={buttonStyle}>Homepage</Link>
          <Link to="/chill" className={buttonStyle}>Just Chill</Link>
        </div>
      </FormBody>
    </div>

  )
}

export default Missing
