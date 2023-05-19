import React, {useState, useEffect} from "react"
import axios, {handleAxiosErrors} from "../../api/axios"
import {Link, useLocation, useNavigate} from "react-router-dom"
import useDecodeToken from "../../hooks/useDecodeToken"
import FormBody from "./FormsPartials/FormBody"

const VerifyForm = () => {
  const [token, setToken] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const location = useLocation()
  const decodeToken = useDecodeToken()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tokenString = urlParams.get('token')
    if (tokenString.length > 0) {
      setToken(tokenString)
    } else setErrMsg("Invalid verification token")
  }, [location.search])

  const verifyUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axios(`/users/verify?token=${token}`, {withCredentials: true})
      if (response.status === 200) {
        navigate("/", {state: {"infoMsg": "Thank you for verifying your account!"}})
      } else setErrMsg("Error while verifying account!")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const buttonGroupStyle = "mt-4 d-flex justify-content-around"
  const buttonStyle = "btn btn-outline-light"

  return (
    <>
      {errMsg.length > 0
        ? <FormBody>
          <h2 className="text-white">{errMsg}</h2>
          <div className={buttonGroupStyle}>
            <Link to="/" className={buttonStyle}>Homepage</Link>
          </div>
        </FormBody>
        : <FormBody>
          <form noValidate={true} onClick={verifyUser} className="text-white">
            <h2>Hi <span className="text-black-50">{token && decodeToken(token)?.sub}</span>!</h2>
            <h2>Please confirm your email:</h2>
            <button className="btn btn-lg btn-outline-light mt-3" type="submit">Verify</button>
          </form>
        </FormBody>
      }
    </>
  )
}

export default VerifyForm