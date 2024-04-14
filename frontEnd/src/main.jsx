import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Layout from './Layout'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import { Route } from 'react-router-dom'
import { createRoutesFromElements } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignUp from './Pages/SignUp.jsx'
import App from './App.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<Layout/>} >
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />}/>
      <Route path="/signup" element={<SignUp />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
