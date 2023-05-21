import React, {useEffect, useState} from "react"
import {useLocation} from "react-router-dom"
import {handleAxiosErrors} from "../../api/axios"
import NewTask from "./ToDo/NewTask"
import Task from "./ToDo/Task"
import AlertElement from "../Partials/AlertElement"
import Navigation from "../Partials/Navigation"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import AddNewTaskButton from "./ToDo/ToDoPartials/AddNewTaskButton"

const Home = () => {
  const [showForm, setShowForm] = useState(false)
  const [tasks, setTasks] = useState([])
  const [errMsg, setErrMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axiosPrivate("/api/todos")
        if (response.status === 200) setTasks(response.data)
        else setErrMsg("Error while downloading tasks")
      } catch (err) {
        handleAxiosErrors(err, setErrMsg)
      }
    }
    getTasks()
    location?.state?.infoMsg && setInfoMsg(location?.state?.infoMsg)
    window.history.replaceState({}, document.title)
    // eslint-disable-next-line
  }, [location?.state?.infoMsg])

  return (
    <section className='vh-100'>
      <Navigation/>
      <AddNewTaskButton showForm={showForm} setShowForm={setShowForm}/>
      <div className={`vh-100 homepage ${showForm ? '' : 'high'}`}>
        <NewTask setTasks={setTasks} showForm={showForm} setShowForm={setShowForm}/>

        {tasks.map(item => <Task key={item.id} task={item} setTasks={setTasks}/>)}

        <AlertElement showAlert={errMsg.length > 0} text={errMsg} setText={setErrMsg} fullScreen={true}/>
        <AlertElement showAlert={infoMsg.length > 0} text={infoMsg} setText={setInfoMsg} info={true} fullScreen={true}/>
      </div>
    </section>
  )
}

export default Home
