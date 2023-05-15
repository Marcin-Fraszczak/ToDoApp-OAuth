import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAnglesUp} from "@fortawesome/free-solid-svg-icons"

const AddNewTaskButton = (props) => {
  return (
    <div className="addNewTaskButton">
      <button className="btn btn-success ms-3 mb-3 text-white" onClick={() => props.setShowForm(!props.showForm)}>
        <span className="me-2">Add new task</span>
        <FontAwesomeIcon icon={faAnglesUp} size="sm" className={props.showForm ? "open" : ""}/>
      </button>
    </div>
  )
}

export default AddNewTaskButton