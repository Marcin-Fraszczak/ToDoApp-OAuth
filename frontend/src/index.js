import React from 'react'
import {createRoot} from 'react-dom/client'
import {AuthProvider} from "./context/AuthProvider"
import {Routes, Route, BrowserRouter} from "react-router-dom"
import {disableReactDevTools} from '@fvilers/disable-react-devtools'
import App from './App'
import BackGround from "./components/BackGround"

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools()
}

const root = createRoot(document.querySelector('#root'))

root.render(
  <React.StrictMode>
    <BackGround>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </BackGround>
  </React.StrictMode>,
)
