import React, {useEffect, useRef, useState} from "react"
import {handleAxiosErrors} from "../../../api/axios"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import useTextValidator from "../../../hooks/useTextValidator"

import TitleInput from "./ToDoPartials/TitleInput"
import AlertElement from "../../Partials/Alert"

const Operations = (props) => {
  const [title, setTitle] = useState('')
  const [isValidTitle, setIsValidTitle] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const titleRef = useRef()
  const axiosPrivate = useAxiosPrivate()
  const textValidator = useTextValidator()

  useEffect(() => {
    setIsValidTitle(textValidator(title, 3))
  }, [title])

  useEffect(() => {
    props.showForm && titleRef.current.focus()
  }, [props.showForm])

  const addOperation = async (e) => {
    e.preventDefault()
    if (isValidTitle) {
      try {
        const response = await axiosPrivate.post(`/api/todos/${props.taskId}/`, JSON.stringify({title}))
        if (response.status === 200) {
          resetForm()
          props.setOperations(prev => [response?.data, ...prev])
        } else setErrMsg("Error while submiting operation")
      } catch (err) {
        handleAxiosErrors(err, setErrMsg)
      }
    }
  }

  const resetForm = () => {
    setTitle("")
    setIsValidTitle(false)
  }

  return (
    <>
      <div className="card-body">

        <form hidden={!props.showForm} onSubmit={addOperation} noValidate={true}>
          <TitleInput title={title} setTitle={setTitle} isValidTitle={isValidTitle} titleRef={titleRef}
                      withButton={true}/>
        </form>
      </div>
      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setErrMsg={setErrMsg}/>

      <ul className="list-group list-group-flush">
        {props.children}
      </ul>
    </>
  )
}

export default Operations