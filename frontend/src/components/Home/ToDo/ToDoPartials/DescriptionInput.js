import React from "react"
import TooltipElement from "../../../Forms/FormsPartials/InputTooltip"

const DescriptionInput = (props) => {

  return (
    <div className="form-outline mb-3">
      <div className="input-group w-75">
        <input
          type="text"
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          className='form-control shadow-lg'
          placeholder="description..."
          style={{backgroundColor: "#D1E2DB"}}
          ref={props.propsRef}
        />
        <TooltipElement type='description'/>
      </div>
    </div>
  )
}

export default DescriptionInput