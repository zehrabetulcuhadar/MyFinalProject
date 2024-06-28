import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import styled from 'styled-components';
import "./../assets/styles/Navbar.css";

const TransparentNavbar = styled(Navbar)`
  background-image: linear-gradient(to right, rgba(147,164,174), rgba(147,164,174), rgba(151,168,178), rgba(179,191,201), rgba(222,231,233));
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 10px 20px;
`;

const Brand = styled(Navbar.Brand)`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: 'LXGW WenKai TC', cursive;
  font-size: 1.1rem;
`;

const Logo = styled.img`
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
`;

const LoginButton = styled(Nav.Link)`
  background-color: #1b466a; 
  color: white !important;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  font-family: 'LXGW WenKai TC', cursive;
  transition: background-color 0.3s ease, transform 0.3s ease;
  &:hover {
    background-color: #3486c1;
    transform: scale(1.05);
  }
`;

const AppNavbar = () => {
  return (
    <TransparentNavbar expand="lg" variant="dark">
      <Container>
        <Brand href="#home">
          <Logo
            src="logo.png"
            alt="İZ Logo"
          />
          İZ - Duygu Takip Uygulaması
        </Brand>
        <Nav className="ml-auto">
          <LoginButton href="/login">Giriş Yap / Kaydol</LoginButton>
        </Nav>
      </Container>
    </TransparentNavbar>
  );
};

export default AppNavbar;