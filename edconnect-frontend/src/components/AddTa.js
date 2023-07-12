import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddTa = () => {
  let [tadata, settadata] = useState({"name":"","roll":"","password":""});


  const handleAddTa = async(e) => {
    e.preventDefault();
    if(tadata.name =="" || tadata.roll =="" || tadata.password==""){
        alert("Please fill form correctly");
        return;
    }
   
    let response = await fetch(
      "http://localhost:8000/api/ta-register/",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify(tadata),
      }
    );
    let data = await response.text();
    if(data==="0"){
        alert("Ta is already present")
    }
    settadata({"name":"","roll":"","password":""});
  }

  return (
    <div className="col-md-4 col-md-offset-4 container float-end my-5 mx-5">
      <h3> Add TA to Database</h3>
      <Form onSubmit={handleAddTa}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={tadata.name} onChange={(e)=>{settadata({...tadata,"name":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Roll</Form.Label>
          <Form.Control type="text" value={tadata.roll} onChange={(e)=>{settadata({...tadata,"roll":e.target.value})}}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="text" value={tadata.password} onChange={(e)=>{settadata({...tadata,"password":e.target.value})}}/>
        </Form.Group>
        <Button variant="success" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
};

export default AddTa;
