import React, {useEffect, useRef, useState} from "react"
import isInt from "validator/es/lib/isInt"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArchive, faBoxOpen, faClock, faTrash} from "@fortawesome/free-solid-svg-icons"
import {handleAxiosErrors} from "../../../api/axios"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"

import NumberInput from "./ToDoPartials/NumberInput"
import AlertElement from "../../Partials/AlertElement"

const Operation = (props) => {
  const [showForm, setShowForm] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [time, setTime] = useState("")
  const [isValidTime, setIsValidTime] = useState(false)
  const [operation, setOperation] = useState(props.operation)
  const [showDelForm, setShowDelForm] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const timeRef = useRef()

  const handleEsc = (e) => {
    if (e.key === 'Escape' && document.activeElement === timeRef.current) {
      hideTimeForm()
      setShowForm(false)
    }
  }

  useEffect(() => {
    time && setIsValidTime(isInt(time))
  }, [time])

  useEffect(() => {
    hideTimeForm()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    showForm && timeRef.current.focus()
  }, [showForm])

  useEffect(() => {
    props.taskFinished && hideTimeForm()
  }, [props.taskFinished])


  const displayTime = value => {
    value = Math.abs(value)
    const rest = value % 1440
    return value >= 1440
      ? `${Math.floor(value / 1440)}d ${Math.floor(rest / 60)}h ${rest % 60}m`
      : value >= 60
        ? `${Math.floor(value / 60)}h ${value % 60}m`
        : `${value}m`
  }

  const hideTimeForm = () => {
    setShowForm(false)
    setTime("")
    setIsValidTime(false)
  }

  const addTime = (e) => {
    e.preventDefault()
    if (time) {
      if (isValidTime) {
        if (parseInt(time)) {
          modifyOperation({time: Math.max(operation.time + parseInt(time), 0)})
        }
      } else setErrMsg("Invalid time format")
    }
  }

  const modifyOperation = async (data) => {
    try {
      const response = await axiosPrivate.put(
        `/api/todos/${operation.task_id}/${operation.id}`, JSON.stringify(data))
      if (response.status === 200) {
        setOperation(response?.data)
        hideTimeForm()
      } else setErrMsg("Error while updating operation")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const deleteOperation = async () => {
    try {
      const response = await axiosPrivate.delete(`/api/todos/${operation.task_id}/${operation.id}`)
      if (response.status === 200) {
        props.setOperations(prev => prev.filter(item => item.id !== response?.data?.id))
      } else setErrMsg("Error while deleting operation")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const buttonClass = (type) => `btn btn-sm btn-${type} shadow mx-2`

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white-50">
      <div style={{textDecoration: operation.finished ? "line-through" : "none"}}>
        {operation.title}
        <span className="badge rounded-pill bg-success ms-3">
          {displayTime(operation.time)}
        </span>
      </div>


      {showForm && !props.taskFinished && !operation.finished &&
        <form onSubmit={addTime} noValidate={true}>
          <NumberInput
            hideTimeForm={hideTimeForm}
            time={time}
            setTime={setTime}
            timeRef={timeRef}
            isValidTime={isValidTime}/>
        </form>
      }

      {!showForm && !props.taskFinished && !showDelForm &&
        <div>
          {!operation.finished &&
            <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
              Add time
              <FontAwesomeIcon icon={faClock} size="lg" className="mx-1"/>
            </button>
          }
          {operation.finished
            ? <button className={buttonClass("dark")} hidden={!operation.finished}
                      onClick={() => modifyOperation({finished: false})}>
              Open
              <FontAwesomeIcon icon={faBoxOpen} size="lg" className="ms-2"/>
            </button>
            : <button className={buttonClass("dark")} hidden={operation.finished}
                      onClick={() => modifyOperation({finished: true})}>
              Finish
              <FontAwesomeIcon icon={faArchive} size="lg" className="ms-2"/>
            </button>
          }

          <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDelForm(true)}>
            <FontAwesomeIcon icon={faTrash} size="lg" className="mx-1"/>
          </button>
        </div>
      }

      {showDelForm && !showForm && !props.taskFinished &&
        <div>
          <button className="btn btn-danger btn-sm me-2" onClick={() => setShowDelForm(false)}>NO</button>
          <span className="mx-2">Confirm deleting operation</span>
          <button className="btn btn-success btn-sm me-2" onClick={deleteOperation}>YES</button>
        </div>
      }

      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setErrMsg={setErrMsg}/>

    </li>
  )
}

export default Operation