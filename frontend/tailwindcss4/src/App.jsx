import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";

export default function App() {
  return (
      <BrowserRouter>
        <ToastContainer position="bottom-right" />

        <Routes>
          {/* Auth Pages (No Navbar & Footer) */}
           <Route path="/login" element={<Login />} />
          
        </Routes>
      </BrowserRouter>
  );
}
