import React from "react"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import {faUserCheck} from "@fortawesome/free-solid-svg-icons"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const FloatingTooltip = (props) => {
  const helpMsg = {
    "verified": ["Account verified",],
    "not_verified": ["Account not verified",],
  }
  const msg = helpMsg[props.type]
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {msg.map((line, ind) => <p key={ind}>{line}</p>)}
    </Tooltip>
  )

  return (
    <OverlayTrigger
      placement={props.direction}
      delay={{show: 250, hide: 400}}
      overlay={renderTooltip}
    >
      <span>
        <span className="me-2">{props.username}</span>
        {props.type === 'verified' ? <FontAwesomeIcon icon={faUserCheck}/> : <FontAwesomeIcon icon={faUser}/>}
      </span>
    </OverlayTrigger>
  )
}

export default FloatingTooltip