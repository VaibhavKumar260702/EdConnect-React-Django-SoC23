import React, { useEffect, useState } from "react";
import NavbarComp from "../components/Navbar";
import { useLocation, Link } from "react-router-dom";

function StudentDashboard() {
  const location = useLocation();
  const studentID = location.pathname.split("/").slice(-1)[0];

  let [studentInfo, setstudentInfo] = useState({});
  let [coursesList,setcoursesList] = useState([]);

  useEffect(() => {
    getInfo();
    getCoursesList();
  }, []);

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



  if (Object.keys(studentInfo).length === 0) return null; //because of asyncronous nature studentInfo is not updated yet

  return (
    <div>
      <NavbarComp username={studentInfo.Name} />

      <table className="my-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name </th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map((course,i) => (
            <tr key={i}>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentDashboard;
