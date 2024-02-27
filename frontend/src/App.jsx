import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/MainTool/Login'
import Protected from './pages/MainTool/Protected'
import Signup from './pages/MainTool/Signup'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App