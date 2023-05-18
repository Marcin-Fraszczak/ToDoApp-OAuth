import React, {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Navigation from "../Partials/Navigation"
import FormBody from "../AuthForms/AuthFormPartials/FormBody"


const VipZone = () => {

  const {auth} = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    !auth?.verified && navigate("/missing", {replace: true, state: {"infoMsg": "Only for verified accounts."}})
  }, [])

  return (
    <>
      <Navigation/>
      <FormBody>
        <h2 className="text-white">Work in progress...</h2>
      </FormBody>
    </>
  )
}

export default VipZone