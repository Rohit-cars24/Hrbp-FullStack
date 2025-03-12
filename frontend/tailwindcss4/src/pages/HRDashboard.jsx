
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import components
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import FilterBar from "../components/FilterBar";
import LeaveRequestsPanel from "../components/LeaveRequestsPanel";
import EmployeeInfoPanel from "../components/EmployeeInfoPanel";

const HRDashboard = () => {
  const [hrName, setHrName] = useState("HR Admin");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch HR data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;  
        const role = decodedToken.roles?.[0];

        // Fetch HR details
        const userResponse = await axios.get(
          `http://localhost:8080/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Set HR name
        setHrName(userResponse.data || "HR Admin");

        // Fetch leave requests
        const leaveResponse = await axios.get(
          `http://localhost:8080/hr/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Set leave requests
        if (leaveResponse.data) {
          setLeaveRequests(leaveResponse.data);
        }

        // Fetch initial team members data (will be updated with pagination)
        fetchTeamMembers(userId, token, role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch team members with pagination
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;  
    const role = decodedToken.roles?.[0];
    
    fetchTeamMembers(userId, token, role);
  }, [currentPage, pageSize, searchQuery]);

  const fetchTeamMembers = async (userId, token, role) => {
    setLoading(true);
    try {
      let response;
      
      if (role === "ROLE_MANAGER") {
        // Use the paginated API for managers
        response = await axios.get(
          `http://localhost:8080/displayUsers/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: currentPage,
              limit: pageSize,
              search: searchQuery || ""
            }
          }
        );
        
        // Extract employee data and pagination details
        const employees = response.data;
        const formattedEmployees = employees.map((employee) => ({
          id: employee.userId,
          email: employee.email,
          name: employee.username,
          position: employee.position || "Employee",
          department: employee.department || "General"
        }));
        
        setTeamMembers(formattedEmployees);
        // If your API returns pagination metadata, use it to set total pages
        // Otherwise estimate based on response size
        setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize) || 1);
      } else {
        // HR role - fetch all users at once
        response = await axios.get(
          `http://localhost:8080/hr/allUsers`,
          { 
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data) {
          const formattedEmployees = response.data.map((employee) => ({
            id: employee.userId,
            email: employee.email,
            name: employee.username,
            position: employee.position || "Employee",
            department: employee.department || "General"
          }));
          
          // For HR, implement client-side pagination and filtering
          let filtered = formattedEmployees;
          
          // Apply search filter if provided
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (employee) =>
                employee.name.toLowerCase().includes(query) ||
                employee.email.toLowerCase().includes(query)
            );
          }
          
          // Calculate total pages based on filtered data
          setTotalPages(Math.ceil(filtered.length / pageSize));
          
          // Paginate the filtered data client-side
          const startIndex = (currentPage - 1) * pageSize;
          const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
          
          setTeamMembers(paginatedData);
        }
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic for leave requests
  const getFilteredLeaveRequests = () => {
    // If leaveRequests is an object with employee names as keys
    if (
      leaveRequests &&
      typeof leaveRequests === "object" &&
      !Array.isArray(leaveRequests)
    ) {
      // If no filters are applied, return the entire object
      if (!monthFilter && !employeeFilter) return leaveRequests;

      // Filter logic for the new data structure
      const filteredRequests = {};
      Object.entries(leaveRequests).forEach(([employeeName, requests]) => {
        // Employee filter
        if (
          employeeFilter &&
          !employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
        ) {
          return;
        }

        // Month filter
        const filteredEmployeeRequests = {};
        Object.entries(requests).forEach(([date, status]) => {
          const requestDate = new Date(date);
          // If month filter is applied, check if it matches
          if (
            !monthFilter ||
            requestDate.getMonth() + 1 === parseInt(monthFilter)
          ) {
            filteredEmployeeRequests[date] = status;
          }
        });

        // Only add if there are filtered requests
        if (Object.keys(filteredEmployeeRequests).length > 0) {
          filteredRequests[employeeName] = filteredEmployeeRequests;
        }
      });

      return filteredRequests;
    }

    // Fallback to existing filtering if data structure is different
    return leaveRequests;
  };

  // Page navigation handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Navigation handlers
  const handleCreateUser = () => {
    navigate("/hr/create-user");
  };

  const handleUpdateUser = () => {
    navigate("/hr/update-user");
  };

  const handleUpdatePassword = () => {
    navigate("/users/update-password");
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-blue-100 fixed inset-0 text-white">
      <div className="relative z-10 flex flex-col min-h-screen p-4 lg:p-6 w-full">
        <Header userName={hrName} title="Autonaut HR Portal" />

        <ActionButtons
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onUpdatePassword={handleUpdatePassword}
        />

        <FilterBar
          employees={teamMembers}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          employeeFilter={employeeFilter}
          setEmployeeFilter={setEmployeeFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="overflow-y-auto max-h-[300px]">
            <LeaveRequestsPanel leaveRequests={getFilteredLeaveRequests()} />
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <div className="bg-white rounded-lg p-4 overflow-hidden flex flex-col shadow-sm flex-1 max-h-full">
              {/* Employee Information Panel Content */}
              <EmployeeInfoPanel 
                employees={teamMembers}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
