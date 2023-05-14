import React, {useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArchive, faBoxOpen, faMinusCircle, faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons"
import {handleAxiosErrors} from "../../../api/axios"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"

import CardBody from "./ToDoPartials/CardBody"
import AlertElement from "../../Partials/Alert"
import Operations from "./Operations"
import Operation from "./Operation"

const Task = (props) => {
  const [task, setTask] = useState(props.task)
  const [operations, setOperations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDelForm, setShowDelForm] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    getOperations()
  }, [])

  useEffect(() => {
    task.finished && setShowForm(false)
  }, [task])

  const getOperations = async () => {
    try {
      const response = await axiosPrivate(`/api/todos/${task.id}/`)
      if (response.status === 200) {
        setOperations(response?.data)
      } else setErrMsg("Error while fetching operations")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const modifyTask = async (finished) => {
    try {
      const data = {
        title: task.title,
        description: task.description,
        finished: finished
      }
      const response = await axiosPrivate.put(`/api/todos/${task.id}`, JSON.stringify(data))
      if (response.status === 200) {
        setTask(response?.data)
      } else setErrMsg("Error while updating task")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const removeTask = async () => {
    try {
      const response = await axiosPrivate.delete(`/api/todos/${task.id}`)
      if (response.status === 200) {
        props.setTasks(prev => prev.filter(item => item.id !== response?.data?.id))
      } else setErrMsg("Error while deleting task")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const buttonClass = (type) => `btn btn-sm btn-${type} shadow mx-1`

  return (
    <CardBody>
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="text-white" style={{textDecoration: task.finished ? "line-through" : "none"}}>{task.title}</h5>
          <h6 className="card-subtitle text-white-50">{task.description}</h6>
        </div>


        {showDelForm
          ? <div>
            <button className={buttonClass("danger")} onClick={() => setShowDelForm(false)}>NO</button>
            <span className="mx-2 text-white">Confirm deleting task</span>
            <button className={buttonClass("success")} onClick={removeTask}>YES</button>
          </div>

          : <div>
            <button className={buttonClass("success")} hidden={task.finished}
                    onClick={() => setShowForm(!showForm)}>
              Add operation
              {showForm
                ? <FontAwesomeIcon icon={faMinusCircle} size="lg" className="ms-2"/>
                : <FontAwesomeIcon icon={faPlusCircle} size="lg" className="ms-2"/>
              }
            </button>

            <button className={buttonClass("dark")} hidden={task.finished}
                    onClick={() => modifyTask(true)}>
              Finish
              <FontAwesomeIcon icon={faArchive} size="lg" className="ms-2"/>
            </button>

            <button className={buttonClass("dark")} hidden={!task.finished}
                    onClick={() => modifyTask(false)}>
              Open
              <FontAwesomeIcon icon={faBoxOpen} size="lg" className="ms-2"/>
            </button>

            <button className={buttonClass("outline-danger")}
                    onClick={() => setShowDelForm(true)}>
              <FontAwesomeIcon icon={faTrash} size="lg" className="mx-1"/>
            </button>
          </div>
        }

      </div>

      <Operations taskId={task.id} showForm={showForm} setOperations={setOperations}>
          {operations && operations.map(item => <Operation
            key={item.id} operation={item} taskFinished={task.finished} setOperations={setOperations}/>)}
      </Operations>

      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setErrMsg={setErrMsg}/>
    </CardBody>
  )
}

export default Task