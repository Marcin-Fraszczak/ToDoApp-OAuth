import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import axios, {handleAxiosErrors} from "../../../api/axios"

const ThirdPartyButton = (props) => {

  const handleClick = async () => {
    if (props.provider === "google") {
      try {
        const response = await axios("/users/auth/google")
        if (response.status === 200) {
          console.log("success")
        } else props.setErrMsg("Error while connecting with Google")
      } catch (err) {
        handleAxiosErrors(err, props.setErrMsg)
      }
    } else console.log("not yet available")
  }

  return (
    <button className="btn mx-1 color-tpb">
      <FontAwesomeIcon icon={props.icon} className="mx-3" size="2xl" onClick={handleClick}/>
    </button>
  )
}

export default ThirdPartyButton