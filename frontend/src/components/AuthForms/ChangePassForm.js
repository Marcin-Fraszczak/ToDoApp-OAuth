import React, {useState, useEffect, useRef} from "react"
import isStrongPassword from "validator/es/lib/isStrongPassword"
import {handleAxiosErrors} from "../../api/axios"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import FormBody from "./AuthFormPartials/FormBody"
import PasswordInput from "./AuthFormPartials/PaswordInput"
import Divider from "./AuthFormPartials/Divider"
import AlertElement from "../Partials/AlertElement"
import Navigation from "../Partials/Navigation"


const ChangePassForm = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [isValidOldPassword, setIsValidOldPassword] = useState(false)
  const [password1, setPassword1] = useState("")
  const [isValidPassword1, setIsValidPassword1] = useState(false)
  const [password2, setPassword2] = useState("")
  const [isValidPassword2, setIsValidPassword2] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const oldPasswordRef = useRef()
  const {auth, setAuth} = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()

  useEffect(() => {
    // oldPasswordRef.current.focus()
  }, [])

  useEffect(() => {
    setIsValidOldPassword((isStrongPassword(oldPassword)))
  }, [oldPassword])

  useEffect(() => {
    setIsValidPassword1((isStrongPassword(password1)))
  }, [password1])

  useEffect(() => {
    setIsValidPassword2((isStrongPassword(password2)))
  }, [password2])

  const resetForm = () => {
    setOldPassword("")
    setPassword1("")
    setPassword2("")
    setIsValidOldPassword(false)
    setIsValidPassword1(false)
    setIsValidPassword2(false)
    setErrMsg("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = ""
    if (!isStrongPassword(oldPassword)) errors += "$#Current password does not match criteria"
    if (!isStrongPassword(password1)) errors += "$#New password (line 1) does not match criteria"
    if (!isStrongPassword(password2)) errors += "$#New password (line 2) does not match criteria"
    if (password1 !== password2) errors += "$#Passwords don't match"

    if (errors.length > 0) setErrMsg(errors)
    else changePassword({
      "username": auth?.username,
      "password": oldPassword,
      password1,
      password2,
    })
  }

  const changePassword = async (data) => {
    try {
      const response = await axiosPrivate.put("/users/me", JSON.stringify(data))
      if (response.status === 200) {
        resetForm()
        setAuth({})
        navigate("/auth", {state: {"infoMsg": "Successfully changed password.$# Log in with new credentials."}})
      } else setErrMsg("Error while changing password")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const wideButtonClass = (type) => `btn btn-${type} btn-lg w-100 shadow mt-1`

  return (
    <>
      <Navigation/>
      <FormBody>

        <form onSubmit={handleSubmit} noValidate={true}>
          <PasswordInput
            password={oldPassword}
            setPassword={setOldPassword}
            isValidPassword={isValidOldPassword}
            placeholder="Current password..."
            passwordRef={oldPasswordRef}
          />

          <Divider centerText=""/>
          <div className="mb-5"></div>

          <PasswordInput
            password={password1}
            setPassword={setPassword1}
            isValidPassword={isValidPassword1}
            placeholder="New password..."
          />
          <PasswordInput
            password={password2}
            setPassword={setPassword2}
            isValidPassword={isValidPassword2}
            placeholder="Repeat new password..."
          />

          <button
            className={wideButtonClass("dark")}
            type="submit"
            disabled={!(isValidOldPassword && isValidPassword1 && isValidPassword2)}
          >Change password
          </button>
        </form>

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      </FormBody>
    </>
  )
}

export default ChangePassForm