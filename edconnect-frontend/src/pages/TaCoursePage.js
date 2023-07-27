import React, { useState ,useEffect} from "react";
import {useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import TaAttendanceComp from './TaAttendanceComp'
import TaClassComp from "./TaClassComp";
import TaAnnouncementsComp from "./TaAnnouncementsComp";
import TaDiscussionComp from "./TaDiscussionComp";

const TaCoursePage = () => {
  const location = useLocation();
  const taInfo = location.state[0];
  const course = location.state[1];
  const taID = location.pathname.split("/").slice(-2)[0];
  let [active,setactive] = useState("home");

  useEffect(() => {
    if(localStorage.getItem('TAtab') !==null){
      setactive(localStorage.getItem('TAtab'));
    }
  }, []);
  

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
        <Navbar.Brand onClick={(e)=>{localStorage.setItem('TAtab','home');setactive("home")}}>{course.courseCode} </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={(e)=>{localStorage.setItem('TAtab','announcements');setactive("announcements")}}>Announcement</Nav.Link>
          <Nav.Link onClick={(e)=>{localStorage.setItem('TAtab','discussion');setactive("discussion")}} >Discussion</Nav.Link>
          <Nav.Link onClick={(e)=>{localStorage.setItem('TAtab','attendance');setactive("attendance")}}>Attendance</Nav.Link>
          <Nav.Link >Assignment</Nav.Link>
          <Nav.Link onClick={(e)=>{localStorage.setItem('TAtab','class');setactive("class")}}>Class</Nav.Link>
        </Nav>
      </Container>
    </Navbar>

    {active === "home" && <Homecomp/>}
    {active === "announcements" && <TaAnnouncementsComp taInfo={taInfo}/>}
    {active === "attendance" && <TaAttendanceComp taInfo={taInfo}/>}
    {active === "discussion" && <TaDiscussionComp taInfo={taInfo}/>}
    {active === "class" && <TaClassComp taInfo={taInfo}/>}

    </div>
  )
}

export default TaCoursePage