import React from "react"
import useLogout from "../hooks/useLogout"
import {useNavigate} from "react-router-dom"

const Navigation = () => {
  const logout = useLogout()
  const navigate = useNavigate()

  const logoutUser = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <button onClick={logoutUser}>logout</button>
  )
}

export default Navigation