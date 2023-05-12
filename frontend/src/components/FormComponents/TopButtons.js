import React from "react"

export const login = "Log in"
export const register = "Register"

const TopButtons = (props) => {
  const smallButtonClass = (type) => `btn btn-lg w-50 mx-2 shadow-sm ${props.formType === type ? 'active' : ''}`

  return (
    <div className="d-flex justify-content-around mb-5">
      <button className={smallButtonClass(login)}
              onClick={() => props.setFormType(login)}>{login}</button>
      <button className={smallButtonClass(register)}
              onClick={() => props.setFormType(register)}>{register}</button>
    </div>
  )
}

export default TopButtons