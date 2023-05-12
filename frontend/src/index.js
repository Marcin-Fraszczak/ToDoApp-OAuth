import React from 'react'
import {createRoot} from 'react-dom/client'
import {AuthProvider} from "./context/AuthProvider"
import {Routes, Route, BrowserRouter} from "react-router-dom"
import App from './App'

const root = createRoot(document.querySelector('#root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
