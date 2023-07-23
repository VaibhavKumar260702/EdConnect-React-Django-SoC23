import React, { useState } from "react";
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import StudentAttendanceComp from "./StudentAttendanceComp";
import {Card } from 'react-bootstrap';
import StudentAnnouncementsComp from "./StudentAnnouncementsComp";
import StudentDiscussionComp from "./StudentDiscussionComp";

const StudentCoursePage = () => {
  const location = useLocation();
  const studentInfo = location.state[0];
  const courseInfo = location.state[1];
  const studentID = location.pathname.split("/").slice(-2)[0];
  const courseCode = location.pathname.split("/").slice(-1)[0];
  let [active,setactive] = useState("home");
  const [taInfo,settainfo]=useState({});

  React.useEffect(() => {
    getTaInfo();
  }, []);


  const getTaInfo = async()=>{
    let response = await fetch(
      `http://localhost:8000/api/get-ta-info/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({"studentid":studentID,"coursecode":courseCode}),
      }
    );
    let data = await response.json();
    settainfo(data);
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand onClick={(e)=>setactive("home")}>{courseCode} </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={(e)=>setactive("announcement")}>Announcement</Nav.Link>
          <Nav.Link onClick={(e)=>setactive("discussion")}>Discussion</Nav.Link>
          <Nav.Link onClick={(e)=>setactive("attendance")}>Attendance</Nav.Link>
          <Nav.Link >Assignment</Nav.Link>
          <Nav.Link >Class</Nav.Link>
        </Nav>
      </Container>
    </Navbar>

    {active === "home" && 
    <div className="justify-content-center align-items-center">
         <h3>Course Name : {courseInfo.courseName}</h3>
         <h3>Professor : {courseInfo.professor}</h3>
         <h3>Credits : {courseInfo.credits}</h3>
         <h3>Description : {courseInfo.description}</h3>

    </div>
   
    }
    {active === "attendance" && <StudentAttendanceComp studentInfo={studentInfo}/>}
    {active === "discussion" && <StudentDiscussionComp studentInfo={studentInfo} taID={taInfo.id} />}
    {active === "announcement" && <StudentAnnouncementsComp taid={taInfo.id}/>}

    </div>

  );
};

export default StudentCoursePage;
