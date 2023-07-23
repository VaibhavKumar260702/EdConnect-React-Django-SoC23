import React, { useState } from "react";
import {useLocation } from "react-router-dom";
import { Table } from 'react-bootstrap';

const TaClassComp = ({taInfo}) => {
  const location = useLocation();
  const taID = location.pathname.split("/").slice(-2)[0];
  const [student_list,set_student_list] = useState([]);

  React.useEffect(() => {
    get_student_list();
  }, []);

  const get_student_list = async()=>{
    let response = await fetch(
      `http://localhost:8000/api/get-student-list/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({"taid":taID}),
      }
    );
    let data = await response.json();
    set_student_list(data); 

  }

  return (
    <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Name</th>
        <th>Roll</th>
      </tr>
    </thead>
    <tbody>
      {student_list.map((student) => (
        <tr key={student.id}>
          <td>{student.Name}</td>
          <td>{student.Roll}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  )
}

export default TaClassComp
