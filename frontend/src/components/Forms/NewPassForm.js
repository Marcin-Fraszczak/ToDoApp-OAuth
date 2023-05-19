import React, {useState, useEffect, useRef} from "react"
import isStrongPassword from "validator/es/lib/isStrongPassword"
import {axiosJson, handleAxiosErrors} from "../../api/axios"
import {useLocation, useNavigate} from "react-router-dom"
import useWideButtonClass from "../../hooks/useWideButtonClass"
import FormBody from "./FormsPartials/FormBody"
import PasswordInput from "./FormsPartials/PaswordInput"
import AlertElement from "../Partials/AlertElement"

const NewPassForm = () => {
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const passwordRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const wideButtonClass = useWideButtonClass()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tokenString = urlParams.get('token')
    if (tokenString.length > 0) {
      setToken(tokenString)
      passwordRef.current.focus()
    } else setErrMsg("Invalid verification token")
  }, [])

  useEffect(() => {
    setIsValidPassword((isStrongPassword(password)))
  }, [password])

  const resetForm = () => {
    setPassword("")
    setIsValidPassword(false)
    setErrMsg("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isStrongPassword(password)) {
      submitNewPassword(token, password)
    } else setErrMsg("Not a string password")
  }

  const submitNewPassword = async (token, password) => {
    try {
      const response = await axiosJson.put(`/users/password_reset?token=${token}`, JSON.stringify(password))
      if (response.status === 200) {
        resetForm()
        navigate("/auth", {
          replace: true,
          state: {"infoMsg": "Successfully changed password.$# Please log in with new credentials."}
        })
      } else setErrMsg("Error while changing password")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  return (
    <>
      <FormBody>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-light mb-2" type="button" onClick={() => navigate("/auth")}>Back to
            login
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate={true} className="text-white-50 text-lg-start">
          <label htmlFor="old-password-input">New password:</label>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            isValidPassword={isValidPassword}
            placeholder="New password..."
            propsRef={passwordRef}
            id="old-password-input"
          />
          <button
            className={wideButtonClass("dark")}
            type="submit"
            disabled={!isValidPassword}
          >Set new password
          </button>
        </form>

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      </FormBody>
    </>
  )
}

export default NewPassForm