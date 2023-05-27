import React, {useEffect} from "react"
import {useLocation} from "react-router-dom"
import axios, {handleAxiosErrors} from "../api/axios"

const Google = () => {
  const location = useLocation()
  const verifyGoogle = async () => {
    if (location?.search) {
      try {
        const response = await axios(`/users/auth/google/verify${location.search}`)
        if (response.status === 200) {
          console.log(response)
        } else console.log("not good")
      } catch (err) {
        console.log("error", err)
      }
    }
  }

  useEffect(() => {
    verifyGoogle()
  }, [])


  return (
    <h2 className="text-white">Google</h2>
  )
}

export default Google