import React from "react"

export const login = "Log in"
export const register = "Register"

const TopButtons = (props) => {
  const smallButtonClass = `btn btn-lg w-50 mx-2 shadow-lg text-white-50`

  return (
    <div className="d-flex justify-content-around mb-5">
      <button className={smallButtonClass}
              style={{borderColor: props.formType === login ? "#a3c7a9" : ""}}
              onClick={() => props.setFormType(login)}>{login}</button>
      <button className={smallButtonClass}
              style={{borderColor: props.formType === register ? "#a3c7a9" : ""}}
              onClick={() => props.setFormType(register)}>{register}</button>
    </div>
  )
}

export default TopButtons