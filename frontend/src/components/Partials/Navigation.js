import {useState} from "react"
import {useNavigate} from "react-router-dom"
import useLogout from "../../hooks/useLogout"
import useAuth from "../../hooks/useAuth"
import {faUserCheck} from "@fortawesome/free-solid-svg-icons"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Timer from "./Timer"
import DeleteForm from "../AuthForms/DeleteForm"
import FloatingTooltip from "./FloatingTooltip"

const Navigation = () => {
  const [showDelForm, setShowDelForm] = useState(false)
  const logout = useLogout()
  const navigate = useNavigate()
  const {auth} = useAuth()

  const logoutUser = async () => {
    await logout()
    navigate('/auth', {state: {"infoMsg": "Successfully logged out."}})
  }

  const navbarStyle = {
    opacity: "0.97",
  }

  const buttonVariant = "outline-light mx-1"

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" style={navbarStyle}>
        <Container className="w-75">
          <Navbar.Brand href="/">ToDoApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="w-100 align-items-baseline justify-content-between">
              <Button variant={buttonVariant} onClick={() => navigate("/chill")}>Chill</Button>
              <span className="text-white-50 mx-4">

                <FloatingTooltip
                  type={auth.verified ? 'verified' : 'not_verified'}
                  direction="bottom"
                  username={auth.username}
                />
              </span>
              <Timer/>
              <NavDropdown title="Account" menuVariant="dark" bg="dark">
                <NavDropdown.Item onClick={() => navigate("/change_password")}>Change Password</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setShowDelForm(true)}>Delete Account</NavDropdown.Item>
              </NavDropdown>
              <Button variant={buttonVariant} onClick={logoutUser}>Log out</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showDelForm && <DeleteForm setShowDelForm={setShowDelForm}/>}
    </>
  )
}

export default Navigation