import React from "react";
import LoginCard from "../components/LoginCard";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import studentIcon from '../assets/studentIcon.png'
import taIcon from '../assets/taIcon.png'
import adminIcon from '../assets/adminIcon.png'


const Homepage = () => {
    return (  
    <div>
        <h3 className="text-center my-5" >Welcome to EdConnect</h3>
      <Container className="">
        <Row>
          <Col>
            <LoginCard title={"Student"} linktoimg = {studentIcon} linktologin={"/studentLogin"} linktoregister={"/studentRegister"} />
          </Col>
          <Col>
            <LoginCard title={"TA"}  linktoimg = {taIcon} linktologin={"/taLogin"}/>
          </Col>
          <Col>
            <LoginCard title={"Admin"}  linktoimg = {adminIcon} linktologin={"/adminLogin"} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Homepage;
