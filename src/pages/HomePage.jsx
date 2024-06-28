import React, { useRef, useState } from 'react';
import Footer from '../components/Footer'
import HomeContent from '../components/HomeContent'
import AppNavbar from '../components/Navbar'
import styled from 'styled-components'
import Presentation from '../components/Presentation'

const HomePageWrapper = styled.div`
  .HomePage {
    position: relative;
  }
`;

const HomePage = () => {
  const presentationRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);

  return (
    <HomePageWrapper>
    <div className='HomePage'>
      <AppNavbar />
      <HomeContent presentationRef={presentationRef} onExploreClick={() => setStartAnimation(true)} />
      <Presentation ref={presentationRef} animate={startAnimation} />
      <Footer />
    </div>
  </HomePageWrapper>
  )
}

export default HomePage