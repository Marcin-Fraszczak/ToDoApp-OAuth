import React, {useState, useEffect, useRef} from "react"
import {useNavigate} from "react-router-dom"
import useHandleEsc from "../../hooks/useHandleEsc"
import {axiosJson, handleAxiosErrors} from "../../api/axios"
import isEmail from "validator/es/lib/isEmail"
import FormBody from "./FormsPartials/FormBody"
import UsernameInput from "./FormsPartials/UsernameInput"
import AlertElement from "../Partials/AlertElement"

const ResetPassForm = () => {
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [success, setSuccess] = useState(false)
  const usernameRef = useRef()
  const navigate = useNavigate()
  const handleEsc = useHandleEsc(-2)

  useEffect(() => {
    !success && usernameRef.current.focus()
    window.addEventListener('keydown', handleEsc)

    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    setIsValidUsername(isEmail(username))
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isValidUsername) {
      try {
        const response = await axiosJson.post("/users/password_reset", JSON.stringify({username}))
        if (response.status === 202) {
          setSuccess(true)
        } else setErrMsg("Error while trying to reset password.")
      } catch (err) {
        handleAxiosErrors(err, setErrMsg)
      }
    } else setErrMsg("Invalid email address.")
  }

  return (
    <>
      {success
        ? <FormBody>
          <h3 className="text-white mb-4">Email with reset password link has been sent to</h3>
          <h3 className="text-black">{username}</h3>
        </FormBody>
        : <FormBody>
          <h3 className="text-white mb-4">Specify email address to send reset link to:</h3>

          <form noValidate={true} onSubmit={handleSubmit}>
            <UsernameInput
              username={username}
              setUsername={setUsername}
              isValidUsername={isValidUsername}
              propsRef={usernameRef}
            />
            <div className="d-flex justify-content-around">
              <button className="btn btn-outline-light my-2" type="submit" disabled={!isValidUsername}>Send link
              </button>
              <button className="btn btn-outline-light my-2" type="button" onClick={() => navigate("/auth")}>Back to
                login
              </button>
            </div>
          </form>

          <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
        </FormBody>
      }
    </>
  )
}

export default ResetPassForm