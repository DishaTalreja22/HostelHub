
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Complaints from "./Complaints";
import Leave from "./Leave";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./Rooms";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import AdminRooms from "./pages/AdminRooms";
import AdminComplaints from "./pages/AdminComplaints";
import AdminLeave from "./pages/AdminLeave";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/leave" element={<AdminLeave />} />
        <Route
  path="/admin/complaints"
  element={<AdminComplaints />}
/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
