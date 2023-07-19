import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation } from "react-router-dom";

function NavbarComp({username}) {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="#">{username + `'s`} Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="#">Profile</Nav.Link>
            <Nav.Link as={Link} to="/">Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComp;
