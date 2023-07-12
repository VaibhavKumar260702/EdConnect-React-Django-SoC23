import NavbarComp from "../components/Navbar";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TaAddCourseModal from "../components/TaAddCourseModal"

function TaDashboard() {
  const location = useLocation();
  const taID = location.pathname.split("/").slice(-1)[0];

  let [taInfo, settaInfo] = useState({});
  let [coursesList, setcoursesList] = useState([]);

  useEffect(() => {
    getInfo();
    getCoursesList();
  }, []);

  let getInfo = async () => {
    let response = await fetch(
      "http://localhost:8000/api/ta-data" + `/${taID}/`
    );
    let data = await response.json();
    settaInfo(data);
  };

  let getCoursesList = async () => {
    let response = await fetch(
      "http://localhost:8000/api/ta-courses-info" + `/${taID}/`
    );
    let data = await response.json();
    setcoursesList(data);
  };

  const handleDelete = async (e, coursecode) => {
    e.preventDefault();
    var result = window.confirm(
      "Are you sure you want to delete " + `${coursecode}` + " ?"
    );
    if (result) {
      let response = await fetch(
        "http://localhost:8000/api/ta-course-remove" +
          `/${taID}/` +
          `${coursecode}/`
      );
      getInfo();
      getCoursesList();
    }
  };

  let [showModal,setshowmodal] = useState(false);

  const ToggleModal = ()=>{
    setshowmodal(!showModal);
  }

  const addCourse = async(coursecode,courseprivatecode) =>{
    
    // make POST call to api to add this course 
    let response = await fetch(
      `http://localhost:8000/api/ta-course-add/${taID}/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({coursecode,courseprivatecode}),
      }
    );
    let data = await response.text();
    if(data === "0"){
      alert("CourseCode or CoursePrivateCode is invalid");
    }

    ToggleModal();
    getInfo();
    getCoursesList();
  }

  if (Object.keys(taInfo).length === 0) return null; //because of asyncronous nature studentInfo is not updated yet


  return (
    <div>
      <NavbarComp username={taInfo.Name} />

      <button className="btn btn-primary text-center" onClick={(e)=>ToggleModal()}>Add Course</button>

      {(showModal===true?<TaAddCourseModal showModal = {showModal} ToggleModal={ToggleModal} addCourse={addCourse}/>:null)}

      <table className="my-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name </th>
            <th> Delete </th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map((course, i) => (
            <tr key={i}>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => handleDelete(e, course.courseCode)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaDashboard;
