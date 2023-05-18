import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import useLogout from "../../hooks/useLogout"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import {handleAxiosErrors} from "../../api/axios"
import {faHouse} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Timer from "./Timer"
import DeleteForm from "../AuthForms/DeleteForm"
import FloatingTooltip from "./FloatingTooltip"
import AlertElement from "./AlertElement"

const Navigation = () => {
  const [showDelForm, setShowDelForm] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")
  const logout = useLogout()
  const navigate = useNavigate()
  const {auth} = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const logoutUser = async () => {
    await logout()
    navigate('/auth', {state: {"infoMsg": "Successfully logged out."}})
  }

  const verifyAccount = async () => {
    try {
      const response = await axiosPrivate.post("/users/verify",
        JSON.stringify({"send": "aa"}))
      if (response.status === 200) setInfoMsg(`Verification email has been sent to ${auth.username}`)
      else setErrMsg("Error while sending verification email.")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const navbarStyle = {
    opacity: "0.97",
  }

  const buttonVariant = "outline-light mx-1"

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" style={navbarStyle}>
        <Container className="w-75">
          <Navbar.Brand href="/">
            <FontAwesomeIcon icon={faHouse}/>
            <span className="ms-2">ToDoApp</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="w-100 align-items-baseline justify-content-between">
              <div>
                <Button variant={buttonVariant} onClick={() => navigate("/chill")}>Chill</Button>
                <Button variant={buttonVariant} onClick={() => navigate("/vip")}>VIP</Button>
              </div>
              <span className="text-white-50 mx-4">

                <FloatingTooltip
                  type={auth.verified ? 'verified' : 'not_verified'}
                  direction="bottom"
                  username={auth.username}
                />
              </span>
              <Timer/>
              <NavDropdown title="Account" menuVariant="dark" bg="dark">
                {!auth?.verified &&
                  <NavDropdown.Item onClick={verifyAccount}>Verify Account</NavDropdown.Item>
                }
                <NavDropdown.Item onClick={() => navigate("/change_password")}>Change Password</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setShowDelForm(true)}>Delete Account</NavDropdown.Item>
              </NavDropdown>
              <Button variant={buttonVariant} onClick={logoutUser}>Log out</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showDelForm && <DeleteForm setShowDelForm={setShowDelForm}/>}
      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg} fullScreen={true}/>
      <AlertElement showAlert={infoMsg.length > 0} text={infoMsg} setText={setInfoMsg} info={true} fullScreen={true}/>
    </>
  )
}

export default Navigation