import React, {useState, useEffect, useRef} from "react"
import {handleAxiosErrors} from "../../api/axios"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import FormBody from "./AuthFormPartials/FormBody"
import UsernameInput from "./AuthFormPartials/UsernameInput"
import AlertElement from "../Partials/AlertElement"

const DeleteForm = (props) => {
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const {auth, setAuth} = useAuth()
  const usernameRef = useRef()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  useEffect(() => {
    setIsValidUsername(username === auth.username)
  }, [username])

  const handleSubmit = (e) => {
    e.preventDefault()
    isValidUsername ? deleteUser() : setErrMsg("Invalid input")
  }

  const deleteUser = async () => {
    try {
      const response = await axiosPrivate.delete("/users/me")
      if (response.status === 200) {
        setAuth({})
        navigate("/auth", {state: {"infoMsg": "Account successfully deleted."}})
      } else setErrMsg("Error while deleting account")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  return (
    <>
      <FormBody>
        <h2 className="text-white">{`Please, type in your username`}</h2>
        <h2 className="text-white">{`to confirm account deletion:`}</h2>
        <h3 className="my-4">{auth.username}</h3>

        <form noValidate={true} onSubmit={handleSubmit}>
          <div className="w-75 m-auto">
            <UsernameInput
              username={username}
              setUsername={setUsername}
              isValidUsername={isValidUsername}
              usernameRef={usernameRef}
            />
          </div>
          <div className="mt-4 d-flex justify-content-around">
            <button className="btn btn-outline-danger" type="submit" disabled={!isValidUsername}>Delete</button>
            <button className="btn btn-outline-light" type="button"
                    onClick={() => props.setShowDelForm(false)}>Cancel
            </button>
          </div>
        </form>

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      </FormBody>
    </>
  )
}

export default DeleteForm