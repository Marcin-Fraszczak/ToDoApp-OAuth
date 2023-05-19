import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const ThirdPartyButton = (props) => {

  return (
    <button className="btn mx-1 color-tpb">
      <FontAwesomeIcon icon={props.icon} className="mx-3" size="2xl"/>
    </button>
  )
}

export default ThirdPartyButton