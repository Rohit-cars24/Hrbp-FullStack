import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HRDashboard from "./pages/HRDashboard";
import CreateUserPage from "./pages/CreateUserPage";
import UpdateUserPage from "./pages/UpdateUserPage";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ByMonth from "./pages/ByMonth";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./Components/ProtectedRoute"; 
import SearchByUserid from "./pages/SearchByUserId" 
import EmployeeDetails from "./pages/EmployeeDetails";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/hr/:userid/:month" element={<SearchByUserid />} />
        <Route path="/updateemployee/:id" element={<EmployeeDetails />} />

        {/* Protected HR Routes */}
        <Route
          path="/hr/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_HR"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/create-user"
          element={
            <ProtectedRoute allowedRoles={["ROLE_HR"]}>
              <CreateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/update-user"
          element={
            <ProtectedRoute allowedRoles={["ROLE_HR"]}>
              <UpdateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/:month"
          element={
            <ProtectedRoute allowedRoles={["ROLE_HR"]}>
              <ByMonth />
            </ProtectedRoute>
          }
        />

        {/* Protected Manager Route */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["ROLE_MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Employee Route */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown paths to 404 */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
