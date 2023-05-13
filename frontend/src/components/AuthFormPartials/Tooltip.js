import React from "react"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import {faCircleQuestion} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const TooltipElement = ({type}) => {
  const helpMsg = {
    "email": [
      "For example:", "example@domain.com"
    ],
    "password": [
      "Password should have:", "at least 8 characters,",
      "at least one capital letter,", "at least one small letter,",
      "at least one digit,", "at least one special sign."
    ],
    "title": [
      "At least:",
      "3 characters long"
    ],
    "description": [
      "This one is",
      "totally optional"
    ]
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" /*dataHtml={true}*/ {...props}>
      {helpMsg[type].map((line, ind) => <p key={ind}>{line}</p>)}
    </Tooltip>
  )

  return (
    <OverlayTrigger
      placement="right"
      delay={{show: 250, hide: 400}}
      overlay={renderTooltip}
    >
      <span className="input-group-text" style={{backgroundColor: "#909C97"}}>
        <FontAwesomeIcon icon={faCircleQuestion}/>
      </span>
    </OverlayTrigger>
  )
}

export default TooltipElement