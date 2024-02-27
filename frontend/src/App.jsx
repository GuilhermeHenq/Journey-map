import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Tool from './pages/MainTool/Tool'
import Login from './pages/MainTool/Login'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Tool />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App