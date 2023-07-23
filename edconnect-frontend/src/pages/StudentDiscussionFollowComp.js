import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ParentDiscussion = ({ parentDiscussion }) => {
  return (
    <Card bg="" text="white" className="my-5 mx-3 my-custom-card-bg">
      <Card.Body>
        <Card.Title>{`Title : ${parentDiscussion.title}`}</Card.Title>
        <Card.Text>{parentDiscussion.description}</Card.Text>
        <Card.Footer>
          <small className="">{`${parentDiscussion.User_type} | ${parentDiscussion.Name} | ${parentDiscussion.Roll} | ${parentDiscussion.Date} | ${parentDiscussion.Time} | ${parentDiscussion.discussion_type}`}</small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

const Reply = ({ i, reply }) => {
  return (
    <Card className="my-5 mx-3">
      <Card.Body>
        <Card.Text>{`${i + 1}) ${reply.description}`}</Card.Text>
        <Card.Footer>
          <small className="text-muted">{`${reply.User_type} | ${reply.Name} | ${reply.Roll} | ${reply.Date} | ${reply.Time}`}</small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

const StudentDiscussionFollowComp = () => {
  const location = useLocation();
  const studentInfo = location.state[0];
  const discussion_id = location.state[1];
  const discussion = location.state[2];
  const [visible, setvisible] = useState(false);
  const [discussionfollowups_list, set_discussionfollowups_list] = useState([]);
  const [description, set_description] = useState("");

  useEffect(() => {
    getDiscussionFollowupList();
  }, []);

  const getDiscussionFollowupList = async () => {
    let response = await fetch(
      `http://localhost:8000/api/get-discussionfollowups-list/${discussion_id}/`
    );
    let data = await response.json();
    set_discussionfollowups_list(data);
  };

  const makeNewFollowUp = async (e) => {
    const confirmation = window.confirm("Are you sure you want to post this?");
    if (confirmation === false) {
      setvisible(false);
      return;
    }
    e.preventDefault();
    const body = {
      userid: studentInfo['id'],
      usertype: 0,
      postid: discussion_id,
      description: description,
    };
    console.log(body);
    let response = await fetch(`http://localhost:8000/api/add-followup/`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/Json",
      },
      body: JSON.stringify(body),
    });
    set_description("");
    setvisible(false);
    getDiscussionFollowupList();
  };

  return (
    <div className="align-items-left">
      {visible === false ? (
        <div className="d-flex justify-content-center">
          <Button
            className="my-3"
            variant="primary"
            onClick={(e) => setvisible(true)}
          >
            Make New FollowUp
          </Button>
        </div>
      ) : null}

      {visible === true ? (
        <div className="col-md-8 col-md-offset-4 container my-5 border rounded p-3">
          <Form>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={description}
                onChange={(e) => set_description(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={(e) => makeNewFollowUp(e)}>
              Post
            </Button>
          </Form>
        </div>
      ) : null}
      <ParentDiscussion parentDiscussion={discussion} />
      <div className="align-items-left">
        {discussionfollowups_list.map((discussionfollowup, i) => (
          <Reply key = {i} i={i} reply={discussionfollowup} />
        ))}
      </div>
    </div>
  );
};

export default StudentDiscussionFollowComp;
