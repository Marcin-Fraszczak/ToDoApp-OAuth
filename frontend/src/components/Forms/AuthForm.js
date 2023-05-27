import React, {useState, useEffect, useRef} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {faGoogle, faFacebookSquare, faGithub} from "@fortawesome/free-brands-svg-icons"
import isEmail from "validator/es/lib/isEmail"
import isStrongPassword from "validator/es/lib/isStrongPassword"
import normalizeEmail from "validator/es/lib/normalizeEmail"
import axios, {handleAxiosErrors, axiosJson} from "../../api/axios"
import useAuth from "../../hooks/useAuth"
import useDecodeToken from "../../hooks/useDecodeToken"
import useWideButtonClass from "../../hooks/useWideButtonClass"
import FormBody from "./FormsPartials/FormBody"
import TopButtons, {login} from "./FormsPartials/TopButtons"
import UsernameInput from "./FormsPartials/UsernameInput"
import PasswordInput from "./FormsPartials/PaswordInput"
import CheckBox from "./FormsPartials/Checkbox"
import Divider from "./FormsPartials/Divider"
import AlertElement from "../Partials/AlertElement"
import ForgotLink from "./FormsPartials/ForgotLink"
import ThirdPartyButton from "./FormsPartials/ThirdPartyButton"

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
  const wideButtonClass = useWideButtonClass()

  useEffect(() => {
    usernameRef.current.focus()
    location?.state?.infoMsg && setInfoMsg(location?.state?.infoMsg)
    window.history.replaceState({}, document.title)
  }, [location?.state?.infoMsg])

  useEffect(() => {
    setIsValidUsername(isEmail(username))
  }, [username])

  useEffect(() => {
    setIsValidPassword((isStrongPassword(password)))
  }, [password])

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

      <Divider centerText="OR CONTINUE WITH:"/>

      <div>
        <ThirdPartyButton icon={faGoogle} provider="google" setErrMsg={setErrMsg}/>
        <ThirdPartyButton icon={faFacebookSquare} provider="facebook" setErrMsg={setErrMsg}/>
        <ThirdPartyButton icon={faGithub} provider="github" setErrMsg={setErrMsg}/>
      </div>
      <span className="color-tpb">(3rd party authentication is still in development...)</span>

      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>
      <AlertElement showAlert={infoMsg.length > 0} text={infoMsg} setText={setInfoMsg} info={true}/>
    </FormBody>
  )
}

export default AuthForm