import React, { useEffect, useState } from 'react';
import "./../assets/styles/HomeContent.css";
import styled, { keyframes } from 'styled-components';
import { useAnimation, motion } from 'framer-motion';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: linear-gradient(100deg, rgba(14,54,62), rgba(14,54,62),  rgba(14,54,62), rgba(14,54,62), rgba(60,118,134), rgba(114,172,182), rgba(141,188,196));
  padding: 0 20px;
  flex-direction: row;
  
  @media (max-width: 768px) {
    flex-direction: column; 
    padding: 20px;
    align-items: center;
  }
`;

const TextContainer = styled.div`
  text-align: center;
  flex-basis: 50%;
  @media (max-width: 768px) {
    flex-basis: 100%; 
    width: 100%;
    text-align: center;
  }
`;

const WelcomeText = styled(motion.div)`
  font-family: 'LXGW WenKai TC', cursive;
  font-size: 4rem;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
  background: linear-gradient(270deg, #ff7e5f, #feb47b, #ff6f61, #ffc3a0);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientAnimation} 15s ease infinite;

  @media (max-width: 768px) {
    font-size: 5rem; 
    white-space: normal; 
    line-height: 1.5; 
    padding: 10px 0;
    margin-top: 300px;
    font-size: 4rem;
`;

const ExploreButton = styled.button`
  font-size: 1.8rem;
  font-family: 'LXGW WenKai TC', cursive;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-image: linear-gradient(to right, rgba(147,164,174), rgba(151,168,178), rgba(179,191,201), rgba(222,231,233));
  color: #1b466a;
  border-radius: 30px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    padding: 10px 20px;
    width: 100%;
    text-align: center;
  }

  &:hover {
    transform: scale(1.05);  
    box-shadow: 0 5px 15px #1b466a; 
  }
`;

const HomeContent = ({ presentationRef, onExploreClick }) => {
  const textToType = "İZ'e Hoşgeldiniz";
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => textToType.substring(0, currentIndex += 1));
      if (currentIndex === textToType.length) clearInterval(interval);
    }, 150); // Yazı hızını yavaşlattık
    return () => clearInterval(interval);
  }, []);

  const scrollToComponent = () => {
    if (presentationRef.current) {
      presentationRef.current.scrollIntoView({ behavior: 'smooth' });
      onExploreClick(true);  // Animasyonu başlat
    }
  };

  return (
    <StyledSection>
      <TextContainer>
        <WelcomeText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {typedText}
        </WelcomeText>
      </TextContainer>
      <div style={{ flexBasis: '50%', textAlign: 'center' }}>
        <ExploreButton onClick={scrollToComponent}>
          Keşfet
        </ExploreButton>
      </div>
    </StyledSection>
  )
}

export default HomeContent