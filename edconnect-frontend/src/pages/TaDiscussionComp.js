import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { format, subMonths, startOfDay } from 'date-fns';

const TaDiscussionComp = ({ taInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const taID = location.pathname.split("/").slice(-2)[0];
  const coursecode = location.pathname.split("/").slice(-1)[0];
  const [visible, setvisible] = useState(false);
  const [editvisible, seteditvisible] = useState(false);
  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [type, settype] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalCurrentPage] = useState(2);
  const [selectedPostType,setSelectedPostType] = useState(0); // 0 = all,1=general, 2==doubts
  const [selectedUserType,setSelectedUserType] = useState(0); // 0=everyone, 1 = mine , 2=student , 3 = TA
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtered_discussion_list,set_filtered_discussion_list] = useState([]);
  const [edit_id,set_edit_id] = useState(0);
  const [edit_title,set_edit_title] = useState("");
  const [edit_description,set_edit_description] = useState("")


  useEffect(() => {
    const today = startOfDay(new Date());
    const formattedToday = format(today, 'yyyy-MM-dd');
    const oneMonthAgo = subMonths(today, 1);
    const formattedOneMonthAgo = format(oneMonthAgo, 'yyyy-MM-dd');
    setStartDate(formattedOneMonthAgo);
    setEndDate(formattedToday);
  }, []);

  useEffect(() => {
    get_filtered_dicussion_list();
  }, [currentPage,selectedPostType,selectedUserType,startDate,endDate]);
  
  const get_filtered_dicussion_list = async ()=>{
    const body = {
      "course_code": coursecode,
       "discussion_user_type":selectedUserType ,
       "logged_user_type": "TA",
       "id": taID,
       "post_type": selectedPostType,
       "start_date": startDate, 
      "end_date": endDate, 
      "page_number": currentPage
      }
    let response = await fetch(
      `http://localhost:8000/api/get-filtered-discussion-list/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify(body),
      }
    );
    let data = await response.json();
    // console.log(data);
    console.log(data[0][0])
    settotalCurrentPage(Math.ceil(parseInt(data[1])/30));
    set_filtered_discussion_list(data[0]);
  }

  const startDiscussion = async (e) => {
    e.preventDefault();
    const body = {
            "coursecode":coursecode,
            "title":title,
            "description": description,
            "discussiontype": type,
            "id":taID,
            "usertype":1
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
      setCurrentPage(1);
      get_filtered_dicussion_list();
  };

  const OpenDiscussion = (e, id,discussion) => {
    e.preventDefault();
    navigate(`/taCoursePage/${taID}/${coursecode}/discussionFollowUps`,{state:[taInfo,id,discussion]});
  };


  const handleClick = (e,discussion)=>{
    e.stopPropagation();
    set_edit_id(discussion.id);
    set_edit_title(discussion.title);
    set_edit_description(discussion.description);
    seteditvisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleEdit = async(e)=>{
    e.preventDefault();
    const confirmation = window.confirm("Are you sure you want to edit this discussion?")
    if(confirmation === false){
      seteditvisible(false);
      return;
    }
    let response = await fetch(
      `http://localhost:8000/api/edit-discussion/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/Json",
        },
        body: JSON.stringify({"id":edit_id,"title":edit_title,"description":edit_description}),
      }
    );
    seteditvisible(false);
    get_filtered_dicussion_list();
  }

  return (
    <div>

    {editvisible === true? 
    <div className="col-md-8 col-md-offset-4 container my-5 border rounded p-3">
    <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={edit_title}
          onChange={(e) => set_edit_title(e.target.value)}
        />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={edit_description}
          onChange={(e) => set_edit_description(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" onClick={(e) => handleEdit(e)}>
        Edit
      </Button>
    </Form>
  </div>
    :null }

      {visible === false && editvisible===false? (
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

      
      <div className="d-flex justify-content-center my-2">  {/* User Type = everyone,mine,student,TA*/}
        <label className="mx-2">User Type</label>
        <select value={selectedUserType} onChange={(e)=>{setSelectedUserType(parseInt(e.target.value));setCurrentPage(1);}}>
          <option value="0"> Everyone</option>
          <option value="1">Mine</option>
          <option value="2">Students</option>
          <option value="3">TA</option>
        </select>
      </div>
      
      <div className="d-flex justify-content-center my-2">  {/* Post Types 0 = all  1 = general;, 2 = doubts*/}
      <label className="mx-2">Post Type</label>
      <select value={selectedPostType} onChange={(e)=>{setSelectedPostType(parseInt(e.target.value));setCurrentPage(1);}}>
        <option value="0"> All</option>
        <option value="1">General</option>
        <option value="2">Doubts</option>
      </select>
      </div>

      <div className="d-flex justify-content-center my-2">  {/* Dates Picker*/}
      <label htmlFor="startDate" className="mx-2 my-2">Start Date:</label>
      <input type="date" id="startDate" value={startDate} onChange={(e)=>{setStartDate(e.target.value);setCurrentPage(1);}} />
      <label htmlFor="endDate" className="mx-2 my-2">End Date:</label>
      <input type="date" id="endDate" value={endDate} onChange={(e)=>{setEndDate(e.target.value);setCurrentPage(1);}}/>
      </div>
      
      <div className="d-flex justify-content-center my-3">  {/* Pages*/}
      <label className="mx-2">Page Number</label>
      <input
        type="number"
        value={currentPage}
        onChange={(e) => setCurrentPage(parseInt(e.target.value))}
        min={1}
        max={totalPages}
      />
      <span className="mx-2"> of {totalPages}</span>
      </div>

      <div className="d-flex justify-content-between">  {/* Previous and Next Button*/}
      <button className= "btn btn-sm btn-primary mx-2 my-2 align-self-start" disabled={currentPage === 1} onClick={(e)=>setCurrentPage(currentPage-1)}>
        Previous Page
      </button>

      <button className= "btn btn-sm btn-primary mx-2 my-2 align-self-end"  disabled={currentPage === totalPages} onClick={(e)=>setCurrentPage(currentPage+1)}>
        Next Page
      </button>
      </div>


      <div className="align-items-left">
        {filtered_discussion_list.map((discussion, i) => (
          <div
            key={discussion.id}
            className="col-sm-5 col-md-12 hand-cursor"
            onClick={(e) => {
              OpenDiscussion(e, discussion.id,discussion);
            }}
          >
            <Card className="my-2 mx-3 highlighted-div">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">{`${(currentPage-1)*30 + i + 1}) ${discussion.title}`}
                {discussion.Roll === taInfo.Roll ?<button onClick={(e)=>handleClick(e,discussion)} className="btn btn-sm btn-info">Edit</button>:null}
                </Card.Title>
                <Card.Text>{discussion.description}</Card.Text>
                <small className="text-muted small " >{`${discussion.User_type} | ${discussion.Name} | ${discussion.Roll} | ${discussion.Date} | ${discussion.Time} | ${discussion.discussion_type}`}</small>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaDiscussionComp;
