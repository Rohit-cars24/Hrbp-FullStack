import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("Authorization");
  const userId = localStorage.getItem("userid");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // // Fetch user role based on token and userId
  // const getUserRole = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:8080/users/${userId}`, {
  //       headers: { Authorization: token },
  //     });
  //     return response.data.role; 
  //   } catch (error) {
  //     console.error("Error fetching user role:", error);
  //     return null;
  //   }
  // };

  const userRole = localStorage.getItem("Role");
  console.log("Meow Meow User role : ",userRole)

  // if (!userRole) {
  //   getUserRole().then((role) => {
  //     if (role) {
  //       localStorage.setItem("userRole", role);
  //       window.location.reload(); 
  //     }
  //   });
  //   return null; 
  // }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
