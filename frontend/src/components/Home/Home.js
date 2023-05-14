import React, {useEffect, useState} from "react"
import {handleAxiosErrors} from "../../api/axios"
import NewTask from "./ToDo/NewTask"
import Task from "./ToDo/Task"
import AlertElement from "../Partials/Alert"
import Navigation from "../Partials/Navigation"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [errMsg, setErrMsg] = useState("")
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    getTasks()
  }, [])


  const getTasks = async () => {
    try {
      const response = await axiosPrivate("/api/todos")
      if (response.status === 200) {
        setTasks(response.data)
      } else setErrMsg("Error while downloading tasks")
    } catch (err) {
      handleAxiosErrors(err, setErrMsg)
    }
  }

  return (
    <section className="vh-100">
      <Navigation/>
      <NewTask setTasks={setTasks}/>

      {tasks.map(item => <Task key={item.id} task={item} setTasks={setTasks}/>)}

      <AlertElement showAlert={errMsg.length > 0} text={errMsg} setErrMsg={setErrMsg}/>
    </section>
  )
}

export default Home
