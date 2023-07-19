import React, { useState } from "react";
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import StudentAttendanceComp from "./StudentAttendanceComp";

const StudentCoursePage = () => {
  const location = useLocation();
  const studentInfo = location.state;
  const studentID = location.pathname.split("/").slice(-2)[0];
  const courseCode = location.pathname.split("/").slice(-1)[0];
  let [active,setactive] = useState("home");
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand onClick={(e)=>setactive("home")}>{courseCode} </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link >Announcement</Nav.Link>
          <Nav.Link >Discussion</Nav.Link>
          <Nav.Link onClick={(e)=>setactive("attendance")}>Attendance</Nav.Link>
          <Nav.Link >Assignment</Nav.Link>
          <Nav.Link >Class</Nav.Link>
        </Nav>
      </Container>
    </Navbar>

    {active === "home" && <h1>Welcome to {courseCode}, Your TA is </h1>}
    {active === "attendance" && <StudentAttendanceComp studentInfo={studentInfo}/>}


    </div>

  );
};

export default StudentCoursePage;
