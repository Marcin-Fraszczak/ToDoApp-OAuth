import React from "react"

const CheckBox = (props) => {

  return (
    <div className="form-check d-flex justify-content-start align-items-center mb-4 mt-3">
      <label className="chkbx">
        <input
          type="checkbox"
          onChange={() => props.setPersist(prev => !prev)}
          checked={props.persist}
        />
        <span className="x"></span>
      </label>
      <label htmlFor="persist"
             className={`ms-2 ${props.persist ? 'text-white' : 'text-white-50'}`}>
        Trust This Device
      </label>
    </div>
  )
}

export default CheckBox