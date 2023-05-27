import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import {Routes, Route} from "react-router-dom"
import Layout from "./components/Layout"
import PersistLogin from "./components/PersistLogin"
import RequireAuth from "./components/RequireAuth"
import Missing from "./components/Missing"
import AuthForm from "./components/Forms/AuthForm"
import Home from "./components/Home/Home"
import Spinner from "./components/Spinner"
import ChillOut from "./components/ChillOut"
import ChangePassForm from "./components/Forms/ChangePassForm"
import ResetPassForm from "./components/Forms/ResetPassForm"
import VerifyForm from "./components/Forms/VerifyForm"
import NewPassForm from "./components/Forms/NewPassForm"
import VipZone from "./components/Vip/VipZone"
import DeleteForm from "./components/Forms/DeleteForm"
import Google from "./components/Google"
const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>

        {/* public routes */}
        <Route path="auth" element={<AuthForm/>}/>
        <Route path="verify" element={<VerifyForm/>}/>
        <Route path="reset" element={<NewPassForm/>}/>
        <Route path="reset_password" element={<ResetPassForm/>}/>
        <Route path="chill" element={<ChillOut/>}/>
        <Route path="spin" element={<Spinner/>}/>
        <Route path="google" element={<Google/>}/>

        {/* protected routes */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="change_password" element={<ChangePassForm/>}/>
            <Route path="delete_account" element={<DeleteForm/>}/>
            <Route path="vip" element={<VipZone/>}/>
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  )
}

export default App

