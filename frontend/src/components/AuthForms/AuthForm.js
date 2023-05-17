import React, {useState, useEffect, useRef} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGoogle} from "@fortawesome/free-brands-svg-icons"
import isEmail from "validator/es/lib/isEmail"
import isStrongPassword from "validator/es/lib/isStrongPassword"
import normalizeEmail from "validator/es/lib/normalizeEmail"
import axios, {handleAxiosErrors, axiosJson} from "../../api/axios"
import useAuth from "../../hooks/useAuth"
import useDecodeToken from "../../hooks/useDecodeToken"
import FormBody from "./AuthFormPartials/FormBody"
import TopButtons, {login} from "./AuthFormPartials/TopButtons"
import UsernameInput from "./AuthFormPartials/UsernameInput"
import PasswordInput from "./AuthFormPartials/PaswordInput"
import CheckBox from "./AuthFormPartials/Checkbox"
import Divider from "./AuthFormPartials/Divider"
import AlertElement from "../Partials/AlertElement"
import ForgotLink from "./AuthFormPartials/ForgotLink"

const AuthForm = () => {
  const [formType, setFormType] = useState(login)
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")

  const usernameRef = useRef()
  const {setAuth, persist, setPersist} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const decodeToken = useDecodeToken()

  useEffect(() => {
    usernameRef.current.focus()
    location?.state?.infoMsg && setInfoMsg(location?.state?.infoMsg)
    window.history.replaceState({}, document.title)
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

  useEffect(() => {
    localStorage.setItem("persist", persist)
  }, [persist])

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
      const response = await axiosJson.post("/users", JSON.stringify(data))
      if (response.status === 200) {
        resetForm()
        const verificationMsg =
          `Email with verification link has been sent to ${data.username}.$#
           Verification is optional, it just adds one bonus feature. $#
           Your account is already fully operational.`
        await loginUser(data, verificationMsg)
      }
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const loginUser = async (data, msg = "") => {
    try {
      const userForm = new FormData()
      userForm.append("username", data.username)
      userForm.append("password", data.password)
      const response = await axios.post("/users/token", userForm, {withCredentials: true})
      if (response.status === 200) {
        resetForm()
        const decoded = decodeToken(response?.data?.access_token)
        setAuth({username: decoded?.sub, verified: decoded?.ver, accessToken: response?.data?.access_token})
        navigate(from, {replace: true, state: {"infoMsg": msg}})
      } else {
        setErrMsg("Error while logging in")
      }
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValidUsername && isValidPassword) {
      const data = {username: normalizeEmail(username), password}
      formType === login
        ? loginUser(data)
        : registerUser(data)
    } else setErrMsg("Invalid input")
  }

  const wideButtonClass = (type) => `btn btn-${type} btn-lg w-100 shadow mt-1`

  return (
    <FormBody>
      <TopButtons formType={formType} setFormType={setFormType}/>

      <form onSubmit={handleSubmit} noValidate={true}>
        <UsernameInput
          username={username}
          setUsername={setUsername}
          isValidUsername={isValidUsername}
          propsRef={usernameRef}
        />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          isValidPassword={isValidPassword}
          placeholder="password..."
        />

        <div className="d-flex justify-content-between align-items-baseline">
          <CheckBox persist={persist} setPersist={setPersist}/>
          <ForgotLink navigate={navigate}/>
        </div>

        <button
          className={wideButtonClass("dark")}
          type="submit"
          disabled={!isValidPassword || !isValidUsername}
        >{formType}</button>
      </form>

      <Divider centerText="OR"/>

      <button className={wideButtonClass("dark")} style={{opacity: "0.8"}}>
        <FontAwesomeIcon icon={faGoogle} className="me-3" size="xl"/>
        Continue with google
      </button>

      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      <AlertElement showAlert={infoMsg.length > 0} text={infoMsg} setText={setInfoMsg} info={true}/>
    </FormBody>
  )
}

export default AuthForm