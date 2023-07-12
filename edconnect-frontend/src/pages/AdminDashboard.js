import React, { useEffect, useState } from "react";
import NavbarComp from "../components/Navbar";
import { useLocation } from "react-router-dom";
import AddCourse  from "../components/AddCourse";
import AddTa from "../components/AddTa";

const AdminDashboard = () => {

  const location = useLocation();
  const adminID = location.pathname.split("/").slice(-1)[0];
  let [adminInfo, setadminInfo] = useState({}); // has student id,name, roll, 

  useEffect(() => {
    getInfo();
  }, []);

  //fetch courses for this student
  let getInfo = async () => {
    let response = await fetch(
      `http://localhost:8000/api/admin-data/${adminID}/`
    );
    let data = await response.json();
    setadminInfo(data);
  };

  if (Object.keys(adminInfo).length === 0) return null; //because of asyncronous nature studentInfo is not updated yet



  return (
    <div>
      <NavbarComp username={adminInfo.Username}/>

      <AddCourse/>
      <AddTa/>


    </div>
  );
}

export default AdminDashboard