import useLogout from "../../hooks/useLogout"
import {useNavigate} from "react-router-dom"
import useRefreshToken from "../../hooks/useRefreshToken"
import useAuth from "../../hooks/useAuth"
import Timer from "./Timer"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

const Navigation = () => {
  const logout = useLogout()
  const navigate = useNavigate()
  const refresh = useRefreshToken()
  const {auth} = useAuth()

  const logoutUser = async () => {
    await logout()
    navigate('/auth')
  }

  const navbarStyle = {
    opacity: "0.97",
  }

  const buttonVariant = "outline-light mx-1"

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" sticky="top" style={navbarStyle}>
      <Container className="w-75">
        <Navbar.Brand href="/">ToDoApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav" className=" justify-content-around">

          <Button variant={buttonVariant} onClick={refresh}>Refresh</Button>
          <Button variant={buttonVariant} onClick={() => navigate("/chill")}>Chill</Button>
          <span className="text-white-50 mx-4">{auth.username}</span>
          <Timer/>
          <Button variant={buttonVariant} onClick={logoutUser}>Log out</Button>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation