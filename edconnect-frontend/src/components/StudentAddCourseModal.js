import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function StudentAddCourseModal({showModal,ToggleModal,addCourse}) {

    let [taPrivateCode,settaPrivateCode] = useState(""); 

  return (
      <Modal show={showModal} onHide={ToggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label> TA Private Code</Form.Label>
              <Form.Control type="text" value={taPrivateCode} onChange={(e)=>{settaPrivateCode(e.target.value)}}  />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ToggleModal} >
            Cancel
          </Button>
          <Button variant="primary" onClick={(e)=>addCourse(taPrivateCode)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default StudentAddCourseModal;