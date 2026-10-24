import { React } from 'react'
import Homepage from './Pages/HomepageComponents/Homepage'
import './App.css'
// import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import CashierPOS from './Pages/BIlling/CashierPOS'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/billing" element={<CashierPOS/>}/>

      </Routes>
    </Router>
  )
}

export default App