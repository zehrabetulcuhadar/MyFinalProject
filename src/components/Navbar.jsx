import React from 'react';
import "./../assets/styles/Navbar.css";
import { FaBars } from 'react-icons/fa'; // FaBars, bars menü simgesidir.
import { LinkContainer } from 'react-router-bootstrap'; // React Router ile uyumlu linkler için
import { Navbar, Nav, Container } from 'react-bootstrap';


function AppNavbar ({ isNavExpanded, toggleNav }) {  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">İZ - Duygu Takip Uygulaması</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNav}>
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className={`${isNavExpanded ? "expanded" : "collapsed"}`}>
          <Nav className="ms-auto">
            <LinkContainer to="/iletisim">
              <Nav.Link>İletişim</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/hakkimizda">
              <Nav.Link>Hakkımızda</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link>Giriş Yap / Kaydol</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar