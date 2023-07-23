import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const TaAnnouncementsComp = ({ taInfo }) => {
  const location = useLocation();
  const taID = location.pathname.split("/").slice(-2)[0];
  const coursecode = location.pathname.split("/").slice(-1)[0];
  const [announcements_list, setattendancelist] = useState([]);
  const [visible, setvisible] = useState(false);
  const [title,set_title] = useState("");
  const [description,set_description] = useState("");

  useEffect(() => {
    getAnnoucementsList();
  }, []);

  const getAnnoucementsList = async () => {
    let response = await fetch(
      `http://localhost:8000/api/get-announcements-list/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({ "taid": taID, "coursecode": coursecode }),
      }
    );
    let data = await response.json();
    setattendancelist(data);
    // console.log(data);
  };

  const makeAnnouncement = async (e) => {
    const confirmation = window.confirm("Are you sure you want to make this announcement?")
    if(confirmation === false){
        setvisible(false);
        return;
    }
    e.preventDefault();
    let response = await fetch(
        `http://localhost:8000/api/make-announcement/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({ "title":title,"description":description,"taid": taID, "coursecode": coursecode }),
        }
      );
      set_title("");
      set_description("");
    setvisible(false);
    getAnnoucementsList();
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
            Make New Announcement
          </Button>
        </div>
      ) : null}

      {visible === true ? (
        <div className="col-md-8 col-md-offset-4 container my-5">
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => set_title(e.target.value)} />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={6} value={description} onChange={(e) => set_description(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" onClick={(e) => makeAnnouncement(e)}>
              Make Announcement
            </Button>
          </Form>
        </div>
      ) : null}

      <div className="align-items-left">
        {announcements_list.map((announcement, i) => (
          <div key={announcement.id} className="col-sm-5 col-md-10">
            <Card className="my-5 mx-3">
              <Card.Body>
                <Card.Title>{`${i + 1}) ${announcement.title}`}</Card.Title>
                <Card.Text>{announcement.description}</Card.Text>
                <Card.Footer>
                  <small className="text-muted">{`${announcement.Date} | ${announcement.Time}`}</small>
                </Card.Footer>
                
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaAnnouncementsComp;
