import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./pages/Homepage";
import LoginRegisterForm from "./components/LoginRegisterForm"
import { BrowserRouter as Router, Switch,Routes, Route, Link } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import TaDashboard from "./pages/TaDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<Homepage/>} />
          <Route path="/studentLogin" exact element={<LoginRegisterForm title = {"Student"} login={1} />} />
          <Route path="/studentRegister" exact element={<LoginRegisterForm title = {"Student"} login={0} />} />
          <Route path="/taLogin" exact element={<LoginRegisterForm title = {"TA"} login={1} /> } />
          <Route path="/adminLogin" exact element={<LoginRegisterForm title = {"Admin"} login={1} />} />
          <Route path="/studentDashboard/:id" exact element={<StudentDashboard/>}/>
          <Route path="/taDashboard/:id" exact element={<TaDashboard/>}/>
          <Route path="/adminDashboard/:id" exact element={<AdminDashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;