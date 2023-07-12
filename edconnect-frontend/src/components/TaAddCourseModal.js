import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function TaAddCourseModal({showModal,ToggleModal,addCourse}) {

    let [courseCode,setcoursecode] = useState("");
    let [coursePrivateCode,setcourseprivatecode] = useState(""); 

  return (
      <Modal show={showModal} onHide={ToggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                value={courseCode}
                onChange={(e)=>{setcoursecode(e.target.value)}}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label> Course Private Code</Form.Label>
              <Form.Control type="text" value={coursePrivateCode} onChange={(e)=>{setcourseprivatecode(e.target.value)}}  />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ToggleModal} >
            Cancel
          </Button>
          <Button variant="primary" onClick={(e)=>addCourse(courseCode,coursePrivateCode)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default TaAddCourseModal;