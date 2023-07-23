import React, { useEffect, useState } from "react";
import NavbarComp from "../components/Navbar";
import { useLocation, Link } from "react-router-dom";
import StudentAddCourseModal from "../components/StudentAddCourseModal"

function StudentDashboard() {
  const location = useLocation();
  const studentID = location.pathname.split("/").slice(-1)[0];

  let [showModal,setshowmodal] = useState(false);
  let [studentInfo, setstudentInfo] = useState({});
  let [coursesList,setcoursesList] = useState([]);

  useEffect(() => {
    getInfo();
    getCoursesList();
  }, []);


  const ToggleModal = ()=>{
    setshowmodal(!showModal);
  }

  //fetch courses for this student
  let getInfo = async () => {
    let response = await fetch(
      "http://localhost:8000/api/student-data" + `/${studentID}/`
    );
    let data = await response.json();
    setstudentInfo(data);
  };

  let getCoursesList = async () => {
    let response = await fetch(
      "http://localhost:8000/api/student-courses-info" + `/${studentID}/`
    );
    let data = await response.json();
    setcoursesList(data);
  };

  const addCourse = async(privatecode) =>{
    
    // make POST call to api to add this course 
    let response = await fetch(
      `http://localhost:8000/api/student-course-add/${studentID}/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({privatecode}),
      }
    );
    let data = await response.text();
    if(data === "0"){
      alert("No TA is available with this privatecode");
    }

    ToggleModal();
    getInfo();
    getCoursesList();
  }



  if (Object.keys(studentInfo).length === 0) return null; //because of asyncronous nature studentInfo is not updated yet

  return (
    <div>
      <NavbarComp username={studentInfo.Name} />

      <button className="btn btn-primary text-center" onClick={(e)=>ToggleModal()}>Add Course</button>

      {(showModal===true?<StudentAddCourseModal showModal = {showModal} ToggleModal={ToggleModal} addCourse={addCourse}/>:null)}

      <table className="my-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name </th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map((course,i) => (
            <tr key={i} data-href="/">
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td><Link to={`/studentCoursePage/${studentID}/${course.courseCode}`} state={[studentInfo,course]}><button>Open</button> </Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentDashboard;
