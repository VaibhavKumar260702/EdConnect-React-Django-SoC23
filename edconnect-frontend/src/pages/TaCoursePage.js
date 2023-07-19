import React, { useState } from "react";
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import TaAttendanceComp from './TaAttendanceComp'

const TaCoursePage = () => {
  const location = useLocation();
  const taInfo = location.state[0];
  const course = location.state[1];
  const taID = location.pathname.split("/").slice(-2)[0];
  let [active,setactive] = useState("home");
  // console.log(taInfo)

  const Homecomp = ()=>{
    return (
      <div>
        <h3>TA Name : {taInfo.Name}</h3>
        <h3>CourseCode : {course.courseCode}</h3>
        <h3>CourseName : {course.courseName}</h3>
        <h3>Professor : {course.professor}</h3>
      </div>
    )
  }
 
  return (
    <div>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand onClick={(e)=>setactive("home")}>{course.courseCode} </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link >Announcement</Nav.Link>
          <Nav.Link >Discussion</Nav.Link>
          <Nav.Link onClick={(e)=>setactive("attendance")}>Attendance</Nav.Link>
          <Nav.Link >Assignment</Nav.Link>
          <Nav.Link >Class</Nav.Link>
        </Nav>
      </Container>
    </Navbar>

    {active === "home" && <Homecomp/>}
    {active === "attendance" && <TaAttendanceComp taInfo={taInfo}/>}

    </div>
  )
}

export default TaCoursePage