import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const StudentDiscussionComp = ({ studentInfo ,taID}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentID = location.pathname.split("/").slice(-2)[0];
  const coursecode = location.pathname.split("/").slice(-1)[0];
  const [discussion_list, setattendancelist] = useState([]);
  const [visible, setvisible] = useState(false);
  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [type, settype] = useState('');

  useEffect(() => {
    getDiscussionList();
  }, []);

  const getDiscussionList = async () => {
    let response = await fetch(
      `http://localhost:8000/api/get-discussion-list/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({ taid: taID, coursecode: coursecode }),
      }
    );
    let data = await response.json();
    setattendancelist(data);
  };

  const startDiscussion = async (e) => {
    e.preventDefault();
    const body = {
            "coursecode":coursecode,
            "title":title,
            "description": description,
            "discussiontype": type,
            "id":studentID,
            "usertype":2
    }
    const confirmation = window.confirm("Are you sure you want to start this discussion?")
    if(confirmation === false){
        setvisible(false);
        return;
    }
    let response = await fetch(
        `http://localhost:8000/api/add-discussion/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify(body),
        }
      );

      set_title("");
      set_description("");
      settype('');
       setvisible(false);
       getDiscussionList();
  };

  const OpenDiscussion = (e, id,i) => {
    e.preventDefault();
    navigate(`/studentCoursePage/${studentID}/${coursecode}/discussionFollowUps`,{state:[studentInfo,id,discussion_list[i]]});
  };

  return (
    <div>
      {visible === false ? (
        <div className="d-flex justify-content-center">
          <Button
            className="my-3"
            variant="primary"
            onClick={(e) => setvisible(true)}
          >
            Start New Discussion
          </Button>
        </div>
      ) : null}

      {visible === true ? (
        <div className="col-md-8 col-md-offset-4 container my-5 border rounded p-3">
          <Form>
            <Form.Select className="mb-3" aria-label="type" value = {type} onChange={(e) => settype(e.target.value)}>
              <option>Select Discussion Type</option>
              <option value="0">General</option>
              <option value="1">Doubts</option>
            </Form.Select>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => set_title(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={description}
                onChange={(e) => set_description(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={(e) => startDiscussion(e)}>
              Post
            </Button>
          </Form>
        </div>
      ) : null}

      <div className="align-items-left">
        {discussion_list.map((discussion, i) => (
          <div
            key={discussion.id}
            className="col-sm-5 col-md-10 hand-cursor"
            onClick={(e) => {
              OpenDiscussion(e, discussion.id,i);
            }}
          >
            <Card className="my-5 mx-3 highlighted-div">
              <Card.Body>
                <Card.Title>{`${i + 1}) ${discussion.title}`}</Card.Title>
                <Card.Text>{discussion.description}</Card.Text>
                <Card.Footer>
                  <small className="text-muted">{`${discussion.User_type} | ${discussion.Name} | ${discussion.Roll} | ${discussion.Date} | ${discussion.Time} | ${discussion.discussion_type}`}</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDiscussionComp;
