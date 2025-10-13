import { useState } from 'react'


import './App.css'
import Index from './components/Index'  
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
    <>
    <Header/>
      <Index></Index>
      <Footer/>
    </>
  )
}

export default App
