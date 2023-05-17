import React, {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"


const VipZone = () => {

  const {auth} = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    !auth?.verified && navigate("/missing", {replace: true, state: {"infoMsg": "Only for verified accounts."}})
  }, [])

  return (
    <div className="text-white">Work in progress...</div>
  )
}

export default VipZone