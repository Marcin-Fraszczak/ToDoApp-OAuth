import React, {useState, useEffect, useRef} from "react"
import isStrongPassword from "validator/es/lib/isStrongPassword"
import {handleAxiosErrors} from "../../api/axios"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useHandleEsc from "../../hooks/useHandleEsc"
import FormBody from "./FormsPartials/FormBody"
import PasswordInput from "./FormsPartials/PaswordInput"
import Divider from "./FormsPartials/Divider"
import AlertElement from "../Partials/AlertElement"
import Navigation from "../Partials/Navigation"

const ChangePassForm = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [isValidOldPassword, setIsValidOldPassword] = useState(false)
  const [password1, setPassword1] = useState("")
  const [isValidPassword1, setIsValidPassword1] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const oldPasswordRef = useRef()
  const password1Ref = useRef()
  const {auth, setAuth} = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const handleEsc = useHandleEsc(-1)

  useEffect(() => {
    oldPasswordRef.current.focus()
    window.addEventListener('keydown', handleEsc)

    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    setIsValidOldPassword((isStrongPassword(oldPassword)))
  }, [oldPassword])

  useEffect(() => {
    setIsValidPassword1((isStrongPassword(password1)))
  }, [password1])

  const resetForm = () => {
    setOldPassword("")
    setPassword1("")
    setIsValidOldPassword(false)
    setIsValidPassword1(false)
    setErrMsg("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = ""
    if (!isStrongPassword(oldPassword)) errors += "$#Current password does not match criteria"
    if (!isStrongPassword(password1)) errors += "$#New password (line 1) does not match criteria"

    if (errors.length > 0) setErrMsg(errors)
    else changePassword({
      "username": auth?.username,
      "password": oldPassword,
      password1,
    })
  }

  const changePassword = async (data) => {
    try {
      const response = await axiosPrivate.put("/users/me", JSON.stringify(data))
      if (response.status === 200) {
        resetForm()
        setAuth({})
        navigate("/auth", {
          replace: true,
          state: {"infoMsg": "Successfully changed password.$# Please log in with new credentials."}
        })
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

        <form onSubmit={handleSubmit} noValidate={true} className="text-white-50 text-lg-start">
          <label htmlFor="old-password-input">Current password:</label>
          <PasswordInput
            password={oldPassword}
            setPassword={setOldPassword}
            isValidPassword={isValidOldPassword}
            placeholder="Current password..."
            propsRef={oldPasswordRef}
            id="old-password-input"
          />

          <Divider centerText=""/>
          <div className="mb-3"></div>
          <label htmlFor="new-password-input">New password:</label>
          <PasswordInput
            password={password1}
            setPassword={setPassword1}
            isValidPassword={isValidPassword1}
            placeholder="New password..."
            propsRef={password1Ref}
            id="new-password-input"
          />

          <button
            className={wideButtonClass("dark")}
            type="submit"
            disabled={!(isValidOldPassword && isValidPassword1)}
          >Change password
          </button>
        </form>

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      </FormBody>
    </>
  )
}

export default ChangePassForm