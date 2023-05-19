import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave, faTimes} from "@fortawesome/free-solid-svg-icons"

const NumberInput = (props) => {

  return (
    <div className="form-outline">
      <div className="input-group input-group-sm w-100">
        <input
          type="number"
          value={props.time}
          onChange={(e) => props.setTime(e.target.value)}
          className="form-control shadow-lg"
          placeholder="Time..."
          ref={props?.propsRef}
          style={{backgroundColor: "#D1E2DB"}}
          max={props.max}
        />

        <button className="btn btn-success" type="submit">
          <FontAwesomeIcon icon={faSave} size="lg" className="mx-1"/>
        </button>
        <button className="btn btn-outline-dark" onClick={props.hideTimeForm} type="button">
          <FontAwesomeIcon icon={faTimes} size="lg" className="mx-1"/>
        </button>

      </div>
    </div>
  )
}

export default NumberInput