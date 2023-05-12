import React from "react"

const CheckBox = (props) => {
  return (
    <div className="form-check d-flex justify-content-start mb-4 mx-2">
      <input className="form-check-input" type="checkbox" value="" id="persist"/>
      <label htmlFor="persist" className="ms-2">Trust This Device</label>
    </div>
  )
}

export default CheckBox