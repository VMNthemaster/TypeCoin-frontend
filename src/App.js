import './App.css'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import React from 'react'
import Navbar from './components/Navbar'
import Username from './pages/Username'
import SinglePlayer from './pages/SinglePlayer'
import MultiPlayer from './pages/MultiPlayer'


function App() {
  

  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/username' element={<Username />} />
          <Route path='/single' element={<SinglePlayer />} />
          <Route path={`multi/:room`} element={<MultiPlayer />} />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
