import 'bootstrap/dist/css/bootstrap.css'
import './index.css'

import {Routes, Route} from "react-router-dom"
import Layout from "./components/Layout"
import PersistLogin from "./components/PersistLogin"
import RequireAuth from "./components/RequireAuth"
import Missing from "./components/Missing"
import AuthForm from "./components/AuthForm"
import Home from "./components/Home"
import BackGround from "./components/BackGround"

const App = () => {

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
          {/* public routes */}
          <Route path="auth" element={<AuthForm/>}/>
          <Route path="back" element={<BackGround/>}/>

          {/* we want to protect these routes */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth/>}>
              <Route path="/" element={<Home/>}/>
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing/>}/>
        </Route>
    </Routes>
  )
}

export default App

