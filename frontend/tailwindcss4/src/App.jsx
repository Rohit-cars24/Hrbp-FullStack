import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HRDashboard from "./pages/HRDashboard";

import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ByMonth from "./pages/ByMonth";

export default function App() {
  return (
      <BrowserRouter>
        <ToastContainer position="bottom-right" />

        <Routes>
          {/* Auth Pages (No Navbar & Footer) */}
           <Route path="/login" element={<Login />} />
           <Route path="/hr" element={<HRDashboard/>} />
           <Route path="/manager" element={<ManagerDashboard/>} />
           <Route path="/employee" element={<EmployeeDashboard/>} />
           <Route path="/hr/:month" element={<ByMonth/>} />

        </Routes>
      </BrowserRouter>
  );
}
