import React, {useState, useEffect, useRef} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCirclePlus, faEraser} from "@fortawesome/free-solid-svg-icons"
import {handleAxiosErrors} from "../../../api/axios"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import useTextValidator from "../../../hooks/useTextValidator"

import CardBody from "./ToDoPartials/CardBody"
import TitleInput from "./ToDoPartials/TitleInput"
import DescriptionInput from "./ToDoPartials/DescriptionInput"
import AlertElement from "../../Partials/AlertElement"


const NewTask = (props) => {
  const [title, setTitle] = useState("")
  const [isValidTitle, setIsValidTitle] = useState(false)
  const [description, setDescription] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const titleRef = useRef()
  const descRef = useRef()
  const axiosPrivate = useAxiosPrivate()
  const textValidator = useTextValidator()

  const handleEsc = (e) => {
    if (e.key === 'Escape' && (document.activeElement === titleRef.current || document.activeElement === descRef.current)) {
      resetForm()
      props.setShowForm(false)
    }
  }

  useEffect(() => {
    props.showForm && titleRef.current.focus()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    setIsValidTitle(textValidator(title, 3))
  }, [title])

  useEffect(() => {
    props.showForm && titleRef.current.focus()
  }, [props.showForm])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setIsValidTitle(false)
    setErrMsg("")
    props.showForm && titleRef.current.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post("api/todos/", JSON.stringify({title, description}))
      if (response.status === 200) {
        resetForm()
        props.setTasks(prev => [response.data, ...prev])
      } else setErrMsg("Error while submitting task")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  const wideButtonClass = (type) => `btn btn-${type} shadow mt-1 mx-2`

  return (
    <>
      <div className={`newTaskForm ${props.showForm && 'show'}`}>
        <CardBody>
          <form onSubmit={handleSubmit} noValidate={true} className="mt-5">
            <TitleInput title={title} setTitle={setTitle} isValidTitle={isValidTitle} titleRef={titleRef}/>
            <DescriptionInput description={description} setDescription={setDescription} descRef={descRef}/>

            <div className="w-75 d-flex justify-content-between">
              <button className={wideButtonClass("dark")} type="submit" disabled={!isValidTitle}>
                Add New Task
                <FontAwesomeIcon icon={faCirclePlus} className="ms-2" size="lg"/>
              </button>

              <div className={wideButtonClass("dark")} onClick={resetForm}>
                Clear Form
                <FontAwesomeIcon icon={faEraser} className="ms-2" size="lg"/>
              </div>
            </div>
          </form>

          <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg}/>

        </CardBody>
      </div>
    </>
  )
}

export default NewTask