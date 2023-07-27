import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const StudentAnnouncementComp = ({taid}) => {
  const location = useLocation();
  const studentID = location.pathname.split("/").slice(-2)[0];
  const coursecode = location.pathname.split("/").slice(-1)[0];
  const [announcements_list, setattendancelist] = useState([]);

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
        body: JSON.stringify({ "taid": taid, "coursecode": coursecode }),
      }
    );
    let data = await response.json();
    setattendancelist(data);
    // console.log(data);
  };


  return (
    <div>
      <div className="align-items-left">
        {announcements_list.map((announcement, i) => (
          <div key={announcement.id} className="col-sm-5 col-md-10">
            <Card className="my-1 mx-3">
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

export default StudentAnnouncementComp;
