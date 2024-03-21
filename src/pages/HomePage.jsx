import React from 'react'
import Footer from '../components/Footer'
import HomeContent from '../components/HomeContent'
import AppNavbar from '../components/Navbar'

const HomePage = () => {
  return (
    <div className='HomePage'>
        <AppNavbar />
        <HomeContent />
        <Footer />
    </div>
  )
}

export default HomePage