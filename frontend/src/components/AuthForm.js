import React, {useState, useEffect, useRef} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGoogle} from "@fortawesome/free-brands-svg-icons"
import axios, {handleAxiosErrors} from "../api/axios"
import isEmail from "validator/es/lib/isEmail"
import isStrongPassword from "validator/es/lib/isStrongPassword"

import BackGround from "./BackGround"
import FormBody from "./FormComponents/FormBody"
import TopButtons, {login} from "./FormComponents/TopButtons"
import UsernameInput from "./FormComponents/UsernameInput"
import PasswordInput from "./FormComponents/PaswordInput"
import CheckBox from "./FormComponents/Checkbox"
import Divider from "./FormComponents/Divider"
import AlertElement from "./FormComponents/Alert"

const AuthForm = () => {
  const [formType, setFormType] = useState(login)
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const usernameRef = useRef()

  useEffect(() => {
    usernameRef.current.focus()
  }, [])


  useEffect(() => {
    setIsValidUsername(isEmail(username))
    errMsg && setErrMsg("")
  }, [username])

  useEffect(() => {
    setIsValidPassword((isStrongPassword(password)))
    errMsg && setErrMsg("")
  }, [password])

  useEffect(() => {
    setErrMsg("")
  }, [formType])

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setIsValidUsername(false)
    setIsValidPassword(false)
    setErrMsg("")
    usernameRef.current.focus()
  }

  const registerUser = async (data) => {
    try {
      const response = await axios.post("/users/", JSON.stringify(data), {withCredentials: true})
      console.log(response?.data)
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const loginUser = async (data) => {
    try {
      const userForm = new FormData()
      userForm.append("username", data.username)
      userForm.append("password", data.password)
      const response = await axios.post("/users/token", userForm, {withCredentials: true})
      console.log(response?.data)
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValidUsername && isValidPassword) {
      const data = {username, password}
      resetForm()
      formType === login
        ? loginUser(data)
        : registerUser(data)
    } else {
      setErrMsg("Invalid input")
    }
  }

  const wideButtonClass = (type) => `btn btn-${type} btn-lg w-100 shadow mt-1`

  return (
    <BackGround>
      <FormBody opaque={errMsg.length > 0}>
        <TopButtons formType={formType} setFormType={setFormType}/>

        <form onSubmit={handleSubmit} noValidate={true}>
          <UsernameInput
            username={username}
            setUsername={setUsername}
            isValidUsername={isValidUsername}
            usernameRef={usernameRef}
          />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            isValidPassword={isValidPassword}
          />
          <CheckBox/>
          <button
            className={wideButtonClass("dark")}
            type="submit"
            disabled={!isValidPassword || !isValidUsername}
          >{formType}</button>
        </form>

        <Divider/>

        <button className={wideButtonClass("dark")} style={{opacity: "0.8"}}>
          <FontAwesomeIcon icon={faGoogle} className="me-3" size="xl"/>
          Continue with google
        </button>

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setErrMsg={setErrMsg}/>
      </FormBody>
    </BackGround>
  )
}

export default AuthForm