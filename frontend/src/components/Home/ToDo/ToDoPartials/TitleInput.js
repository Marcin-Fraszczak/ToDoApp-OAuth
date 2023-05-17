import React from "react"
import TooltipElement from "../../../AuthForms/AuthFormPartials/InputTooltip"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons"

const TitleInput = (props) => {

  return (
    <div className="form-outline mb-3">
      <div className="input-group w-75">
        {props.withButton &&
          <button className="btn btn-success btn-sm">
            Add
            <FontAwesomeIcon icon={faCirclePlus} className="ms-2" size="lg"/>
          </button>
        }
        <input
          type="text"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          className={
            `form-control shadow-lg ${
              props.title
                ? props.isValidTitle
                  ? 'is-valid'
                  : 'is-invalid'
                : ''
            }`
          }
          placeholder="title..."
          ref={props?.propsRef}
          required
          style={{backgroundColor: "#D1E2DB"}}
        />
        <TooltipElement type='title'/>

      </div>
    </div>
  )
}

export default TitleInput