import React from "react"
import TooltipElement from "./InputTooltip"

const PasswordInput = (props) => {

  return (
    <div className="form-outline mb-4">
      <div className="input-group">
        <input
          type="password"
          value={props.password}
          onChange={(e) => props.setPassword(e.target.value)}
          className={
            `form-control form-control-lg shadow-sm ${
              props.password
                ? props.isValidPassword
                  ? 'is-valid'
                  : 'is-invalid'
                : ''
            }`
          }
          placeholder={props.placeholder}
          required
          style={{backgroundColor: "#D1E2DB"}}
          ref={props?.ref}
        />
        <TooltipElement type='password'/>
      </div>
    </div>
  )
}

export default PasswordInput