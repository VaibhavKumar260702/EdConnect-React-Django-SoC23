import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

const LoginRegister = ({ title, login }) => {
  let navigate = useNavigate();

  const [username, setusername] = useState(""); //admin
  const [name, setname] = useState(""); // for student register,
  const [roll, setroll] = useState(""); // student/ta login
  const [password, setpassword] = useState(""); // all

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === "Student" && login === 0) {
      //if user is student and want to register
      registerStudent();
    } else {
      // student/ta/admin want to login
      // ta and student both have roll and password
      // admin have username and password

      (async () => {
        const validid = await validateUser();
        if (validid === "-1") {
          alert("Invalid User");
          setpassword("");
        } else if (title === "Student") {
          navigate(`/studentDashboard/${validid}`);
        } else if (title === "TA") {
          navigate(`/taDashboard/${validid}`);
        } else {
          navigate(`/adminDashboard/${validid}`);
        }
      })();
    }
  };

  const registerStudent = async () => {
    //register the student in database

    // registering user
    let response = await fetch("http://localhost:8000/api/student-register/", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/Json",
      },
      body: JSON.stringify({
        name,
        roll,
        password
      }),
    });
    let data = await response.text();
    if(data==='0'){
      alert("Already registered!")
      return;
    }
    if(data==='1'){
      setname("");
      navigate("/studentLogin");
    }
  };

  const validateUser = async () => {
    //do validation from backend
    let type = title.toLowerCase();
    let body_data =
      type === "admin" ? { username, password } : { roll, password };
    let response = await fetch(
      "http://localhost:8000/api/" + `${type}` + "-login/",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify(body_data),
      }
    );
    let data = await response.text();
    return data;
  };

  return (
    <div className="col-md-4 col-md-offset-4 container">
      <h3 className="text-center my-5">
        {title + (login === 1 ? " Login" : " Register")}
      </h3>

      <Form onSubmit={handleSubmit}>
        {title === "Student" && login === 0 ? (
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </Form.Group>
        ) : null}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            {title === "Admin" ? "Username" : "Roll Number"}
          </Form.Label>
          <Form.Control
            type="text"
            value={title === "Admin" ? username : roll}
            onChange={
              title === "Admin"
                ? (e) => setusername(e.target.value)
                : (e) => setroll(e.target.value)
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Submit
        </Button>
        <br />
        <br />
        {title === "Student" && login === 1 ? (
          <Link to={"/studentRegister"}>New Registration?</Link>
        ) : null}
        {title === "Student" && login === 0 ? (
          <Link to={"/studentLogin"}>Already have account?</Link>
        ) : null}
        <br />
        <Link to={"/"}>Home Page</Link>
      </Form>
    </div>
  );
};

export default LoginRegister;
