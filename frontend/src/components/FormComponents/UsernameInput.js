import React from "react"
import TooltipElement from "./Tooltip"

const UsernameInput = (props) => {

  return (
    <div className="form-outline mb-4">
      <div className="input-group">
        <input
          type="email"
          value={props.username}
          onChange={(e) => props.setUsername(e.target.value)}
          className={
            `form-control form-control-lg shadow-sm ${
              props.username
                ? props.isValidUsername
                  ? 'is-valid'
                  : 'is-invalid'
                : ''
            }`
          }
          placeholder="email..."
          ref={props.usernameRef}
          required
          style={{backgroundColor: "#D1E2DB"}}
        />
        <TooltipElement type='email'/>
      </div>
    </div>
  )
}

export default UsernameInput