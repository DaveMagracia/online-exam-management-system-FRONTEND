import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'

import './App.css'

export default function App() {
  return (
      <Router>
        {/* "Switch" now changed to "Routes" in react router v6 */}
        <Routes>
          {/* "component" attr now changed to "element" in react router v6 */}
          <Route path='/' element={
              <>
                <Navbar />
                
                <div className="App d-flex align-items-center justify-content-center">
                  <img src='../logo512.png'/>
                  <div>
                    <h1 className='display-1'>Hello, World!</h1>
                    <h1 className='lead text-center'>Kung nakikita nyo to sa browser, goods na :></h1>
                  </div>
                </div>
              </>
          }>
          </Route>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </Router>
  )
}
