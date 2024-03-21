import React, { useEffect, useState } from 'react';
//import ColorCard from './Card';
import "./../assets/styles/HomeContent.css";
import styled from 'styled-components';
import ColoredDivs from './ColoredDivs';
import { motion } from 'framer-motion';

const StyledHomePage = styled.div`
  height: calc(100vh); 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  font-size: 40px;
`;

const HomeContent = () => {
  const textToType = "İZ'e hoşgeldiniz :)";
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setTypedText((prevTypedText) => {
        currentIndex++;
        return textToType.substring(0, currentIndex);
      });
      if (currentIndex >= textToType.length) {
        clearInterval(interval);
      }
    }, 150); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <StyledHomePage>
        <motion.div>
          {typedText}
        </motion.div>
      </StyledHomePage>
      <ColoredDivs />
    </div>  
  )
}

export default HomeContent

    /*
    <div className="home-content">
       
      <div className='cards-container'>
        <div className="left-side">
          <ColorCard variant="Primary" />
        </div>
        <div className="right-side">
          <div className="top-cards">
            <ColorCard variant="Secondary" />
            <ColorCard variant="Success" />
          </div>
          <div className="bottom-card">
            <ColorCard variant="Danger" />
          </div>
        </div>
      </div>
      <div className="additional-content">
        <div className="content-section">
          <div className="image-side">
            <img src="image_url.jpg" alt="Description" />
          </div>
          <div className="text-side">
            <p>Here is some text content...</p>
          </div>
        </div>
        <div className="content-section">
          <div className="image-side">
            <img src="image_url.jpg" alt="Description" />
          </div>
          <div className="text-side">
            <p>Here is some more text content...</p>
          </div>
        </div>
      </div> 
    </div>
    */