import * as React from 'react';
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { alertTitleClasses } from '@mui/material';
import Table from 'react-bootstrap/Table';
import { parse, format } from 'date-fns';


export default function TaAttendanceComp({taInfo}) {
    const location = useLocation();
    const taID = location.pathname.split("/").slice(-2)[0];
    const coursecode = location.pathname.split("/").slice(-1)[0];
    const [val,setVal] = React.useState(dayjs());
    const [presentDates,setpresentDates] = React.useState([]);
    const [sessionid,setsessionid] = React.useState(0);
    const [todaydate,settodaydate] = React.useState("");
    const [attendanceList,setattendancelist]=React.useState([]);

    React.useEffect(() => {
      updateTodayDate(val);
      getAttendanceList(val);
    }, []);

    const checkTaSession = async() => {
      let response = await fetch(
        `http://localhost:8000/api/check-ta-session/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({"coursecode":coursecode,"taid":taID}),
        }
      );
      let data = await response.text();
      setsessionid(parseInt(data));
      if(data !=='-1'){ //there is already a session
        alert("There is already attendance session within 5min")
        return;
      }
      alert("you can start taking attendance")
    }

    const startAttendance = async () =>{
      let response = await fetch(
        `http://localhost:8000/api/start-attendance/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({"coursecode":coursecode,"taid":taID}),
        }
      );
      let data = await response.text();
      setsessionid(parseInt(data));
    }

    const updateTodayDate = (newvalue) =>{
      const datestr = newvalue.$d.toString().split(" ");
      settodaydate(datestr[0]+" "+datestr[1]+" "+datestr[2]+" "+datestr[3]);
    }

    const getAttendanceList = async(newval)=>{
      const datestr = newval.$d.toString().split(" ");
      let _date = datestr[1]+" "+datestr[2]+" "+datestr[3];
      _date = parse(_date, 'MMM dd yyyy', new Date());
      _date = format(_date, 'yyyy-MM-dd').toString()
      let response = await fetch(
        `http://localhost:8000/api/get-attendance-list/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({"coursecode":coursecode,"taid":taID,"date":_date}),
        }
      );
      let data = await response.json();
      setattendancelist(data);    
    }


  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        disableFuture
        value={val}
        onChange={(newvalue)=>{setVal(newvalue);updateTodayDate(newvalue);getAttendanceList(newvalue)}}

      />
    </LocalizationProvider>
    {sessionid === -1 && <button className='btn btn-sm btn-primary' onClick={(e)=>{startAttendance()}}> Start Attendance</button>}
    <button className='btn btn-sm btn-primary' onClick={(e)=>checkTaSession()}> Check Attendance</button>
    
    <h3>Click on Check attendance   button to check if you can start taking attendance</h3>
    <h3 className='text-center'>Attendance for : {todaydate} </h3>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Roll</th>
          <th>Name</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
      {attendanceList.map((obj,i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{obj['roll']}</td>
              <td>{obj['name']}</td>
              <td>{obj['time']}</td>
            </tr>
          ))}
      </tbody>
    </Table>

    </>
  );
}

