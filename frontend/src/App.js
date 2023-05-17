import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import {Routes, Route} from "react-router-dom"
import Layout from "./components/Layout"
import PersistLogin from "./components/PersistLogin"
import RequireAuth from "./components/RequireAuth"
import Missing from "./components/Missing"
import AuthForm from "./components/AuthForms/AuthForm"
import Home from "./components/Home/Home"
import Spinner from "./components/Spinner"
import ChillOut from "./components/ChillOut"
import ChangePassForm from "./components/AuthForms/ChangePassForm"
import VerifyForm from "./components/AuthForms/VerifyForm"

const App = () => {

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>

          {/* public routes */}
          <Route path="auth" element={<AuthForm/>}/>
          <Route path="verify" element={<VerifyForm/>}/>
          <Route path="chill" element={<ChillOut/>}/>
          <Route path="spin" element={<Spinner/>}/>

          {/* protected routes */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="change_password" element={<ChangePassForm/>}/>
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing/>}/>
        </Route>
    </Routes>
  )
}

export default App

