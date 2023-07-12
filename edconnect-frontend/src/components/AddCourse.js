import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddCourse = () => {
  let [coursedata, setcoursedata] = useState({"coursecode":"","coursename":"","courseprivatecode":"","professor":"","des":"","credit":0});


  const handleAddCourse = async(e) => {
    e.preventDefault();
    if(coursedata.coursecode =="" || coursedata.coursename ==""){
        alert("Please fill form correctly");
        return;
    }

    console.log(coursedata);
   
    let response = await fetch(
      "http://localhost:8000/api/add-course/",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify(coursedata),
      }
    );
    let data = await response.text();
    if(data==="0"){
        alert("Course is already present")
    }
    setcoursedata({"coursecode":"","coursename":"","courseprivatecode":"","professor":"","des":"","credit":0});
  }

  return (
    <div className="col-md-4 col-md-offset-4 container float-start my-5 mx-5">
      <h3> Add Course to Database</h3>
      <Form onSubmit={handleAddCourse}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Course Code</Form.Label>
          <Form.Control type="text" value={coursedata.coursecode} onChange={(e)=>{setcoursedata({...coursedata,"coursecode":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Course Name</Form.Label>
          <Form.Control type="text" value={coursedata.coursename} onChange={(e)=>{setcoursedata({...coursedata,"coursename":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Course Private Code</Form.Label>
          <Form.Control type="text" value={coursedata.courseprivatecode} onChange={(e)=>{setcoursedata({...coursedata,"courseprivatecode":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label> Professor</Form.Label>
          <Form.Control type="text" value={coursedata.professor} onChange={(e)=>{setcoursedata({...coursedata,"professor":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows="5" value={coursedata.des} onChange={(e)=>{setcoursedata({...coursedata,"des":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Credits</Form.Label>
          <Form.Control type="number" value={coursedata.credit} onChange={(e)=>{setcoursedata({...coursedata,"credit":e.target.value})}}/>
        </Form.Group>

        <Button variant="success" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
};

export default AddCourse;
