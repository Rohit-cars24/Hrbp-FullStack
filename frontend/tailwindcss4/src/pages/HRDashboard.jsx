import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // Fetch HR data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("Authorization");

        // Fetch HR details
        const userResponse = await axios.get(
          `http://localhost:8080/users/${userId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        // Set HR name
        setHrName(userResponse.data || "HR Admin");

        // Fetch leave requests
        const leaveResponse = await axios.get(
          `http://localhost:8080/hr/${userId}`,
          { headers: { Authorization: `${token}` } }
        );

        console.log(leaveResponse.data);

        // Set leave requests
        if (leaveResponse.data) {
          setLeaveRequests(leaveResponse.data);
        }

        const employeesResponse = await axios.get(
          `http://localhost:8080/hr/allUsers`,
          { headers: { Authorization: token } }
        );

        if (employeesResponse.data) {
          const formattedEmployees = employeesResponse.data.map((employee) => ({
            id: employee.userId,
            email: employee.email,
            name: employee.username,
          }));
          setTeamMembers(formattedEmployees);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  // Get filtered team members
  const getFilteredTeamMembers = () => {
    let filtered = [...teamMembers];

    if (employeeFilter) {
      filtered = filtered.filter(
        (employee) => employee.id.toString() === employeeFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query)
      );
    }

    return filtered;
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
            <EmployeeInfoPanel employees={getFilteredTeamMembers()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
