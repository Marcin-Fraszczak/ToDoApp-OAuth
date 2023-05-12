import React from "react"
import TooltipElement from "./Tooltip"

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
          placeholder="password..."
          required
        />
        <TooltipElement type='password'/>
      </div>
    </div>
  )
}

export default PasswordInput