import React, {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import useHandleEsc from "../../hooks/useHandleEsc"
import Navigation from "../Partials/Navigation"
import FormBody from "../Forms/FormsPartials/FormBody"

const VipZone = () => {
  const {auth} = useAuth()
  const navigate = useNavigate()
  const handleEsc = useHandleEsc("/")

  useEffect(() => {
    !auth?.verified && navigate("/missing", {replace: true, state: {"infoMsg": "Only for verified accounts."}})
    window.addEventListener('keydown', handleEsc)

    return () => window.removeEventListener('keydown', handleEsc)
    // eslint-disable-next-line
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