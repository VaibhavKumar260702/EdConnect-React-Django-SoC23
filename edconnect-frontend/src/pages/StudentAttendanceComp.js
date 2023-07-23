import * as React from 'react';
import {  BrowserRouter as Router, Switch,Routes, Route, Link ,useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { alertTitleClasses } from '@mui/material';


export default function StudentAttendanceComp({studentInfo}) {
    const location = useLocation();
    const studentID = location.pathname.split("/").slice(-2)[0];
    const coursecode = location.pathname.split("/").slice(-1)[0];
    const [presentDates,setpresentDates] = React.useState([]);
    const [val,setVal] = React.useState(null);
    const [buttonvisible,setbuttonvisible]=React.useState(false);
    const [alreadymarked,setalreadymarked] = React.useState(false);
    const [sessionid,setsessionid] = React.useState(-1);

    React.useEffect(() => {
      getAttendance();
    }, []);

    function ServerDay(props) {
      const { presentDates = [], day, outsideCurrentMonth, ...other } = props;
      const currdateArray = props.day.$d.toString().split(" ");
      const currdate = currdateArray[1]+"-"+currdateArray[2]+"-"+currdateArray[3];
      const isSelected =
        !props.outsideCurrentMonth && presentDates.indexOf(currdate)>= 0;
      return (
        <Badge
          key={props.day.toString()}
          overlap="circular"
          badgeContent={isSelected ? '😎' : undefined}
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      );
    }


    const getAttendance = async() =>{ //gets the attendance records
      let response = await fetch(
        `http://localhost:8000/api/get-attendance/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({"roll":studentInfo['Roll'],"coursecode":coursecode}),
        }
      );
      let data = await response.json();
      setpresentDates(data);
      const todayDateArray = Date().toString().split(" ");
      const today_date = todayDateArray[1]+"-"+todayDateArray[2]+"-"+todayDateArray[3];
      if (data.includes(today_date)===true){
        setalreadymarked(true);
      }
      
    }

    const checkAttendance = (date_time) => {
      const selecteddateArray = date_time.split(" ");
      const selected_date = selecteddateArray[1]+"-"+selecteddateArray[2]+"-"+selecteddateArray[3];
      const todayDateArray = Date().toString().split(" ");
      const today_date = todayDateArray[1]+"-"+todayDateArray[2]+"-"+todayDateArray[3];
      if(selected_date===today_date){

        if(alreadymarked===true){
          alert("you have already marked attendance");
          return;
        }

        //check if session is there now to mark attendance
        (
          async() =>{ //gets the attendance records
            let response = await fetch(
              `http://localhost:8000/api/check-session/`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json, text/plain",
                  "Content-Type": "application/Json",
                },
                body: JSON.stringify({"roll":studentInfo['Roll'],"coursecode":coursecode}),
              }
            );
            let data = await response.text();
            setsessionid(parseInt(data));
            if(data !== '-1')setbuttonvisible(true);
            else {alert("There is no attendance right now")}
          }
        )();
        
      }
    }

    const markAttendance = async() =>{
      let response = await fetch(
        `http://localhost:8000/api/mark-attendance/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/Json",
          },
          body: JSON.stringify({"roll":studentInfo['Roll'],"sessionid":sessionid}),
        }
      );
      let data = await response.text();
      if(data===0)alert("cannot mark your attendance")
      setalreadymarked(true);
      setbuttonvisible(false);
      getAttendance();
    }

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        disableFuture
        value={val}
        // renderLoading={() => <DayCalendarSkeleton />}
        onChange={(newvalue)=>{setVal(newvalue);checkAttendance(newvalue.$d.toString())}}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            presentDates,
          },
        }}
      />
    </LocalizationProvider>
    {buttonvisible===true && <button className='btn btn-sm btn-primary' onClick={(e)=>{markAttendance()}}> Mark attendance</button>}
    
    <h3>Click on today date to check if you can mark attendance now</h3>
    </>
  );
}
