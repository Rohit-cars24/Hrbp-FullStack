import React, { useState, useEffect } from "react";
import axios from "axios";

// Import components
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import FilterBar from "../components/FilterBar";
import LeaveRequestsPanel from "../components/LeaveRequestsPanel";
import EmployeeInfoPanel from "../components/EmployeeInfoPanel";

const HRDashboard = () => {
  const [hrName, setHrName] = useState("Alex Johnson");
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch HR data on component mount
  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("Authorization");

        // Fetch HR name and info
        const hrResponse = await axios.get(
          `http://localhost:8080/users/${userId}`,
          { headers: { Authorization: token } }
        );

        if (hrResponse.data) {
          setHrName(hrResponse.data.name || "HR Admin");
        }

        // Fetch employees
        const employeesResponse = await axios.get(
          "http://localhost:8080/users/employees",
          { headers: { Authorization: token } }
        );

        if (employeesResponse.data) {
          setEmployees(employeesResponse.data);
        }

        // Fetch leave requests
        const leaveResponse = await axios.get(
          "http://localhost:8080/leave/requests",
          { headers: { Authorization: token } }
        );

        if (leaveResponse.data) {
          setLeaveRequests(leaveResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // For demo, set mock data if API fails
    setTimeout(() => {
      if (employees.length === 0) {
        setEmployees([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Developer",
            joinDate: "2023-05-15",
          },
          // ... other employee data
        ]);
      }

      if (leaveRequests.length === 0) {
        setLeaveRequests([
          {
            id: 101,
            employeeId: 1,
            employeeName: "John Doe",
            type: "Sick Leave",
            startDate: "2025-03-10",
            endDate: "2025-03-12",
            status: "Pending",
          },
          {
            id: 102,
            employeeId: 2,
            employeeName: "Shreyas",
            type: "Sick Leave",
            startDate: "2025-03-10",
            endDate: "2025-03-12",
            status: "Approved",
          },
          {
            id: 102,
            employeeId: 2,
            employeeName: "Shreyas",
            type: "Sick Leave",
            startDate: "2025-03-10",
            endDate: "2025-03-12",
            status: "Approved",
          },
          // ... other leave request data
        ]);
      }
    }, 1000);
  }, []);

  // Get filtered leave requests
  const getFilteredLeaveRequests = () => {
    let filtered = [...leaveRequests];

    if (monthFilter) {
      filtered = filtered.filter((request) => {
        const requestMonth = new Date(request.startDate).getMonth() + 1;
        return requestMonth === parseInt(monthFilter);
      });
    }

    if (employeeFilter) {
      filtered = filtered.filter(
        (request) => request.employeeId.toString() === employeeFilter
      );
    }

    return filtered;
  };

  // Get filtered employees
  const getFilteredEmployees = () => {
    let filtered = [...employees];

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
          employee.email.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Navigation handlers
  const handleCreateUser = () => {
    window.location.href = "/create-user";
  };

  const handleUpdateUser = () => {
    window.location.href = "/update-user";
  };

  const handleUpdatePassword = () => {
    window.location.href = "/update-password";
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
          employees={employees}
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
            <EmployeeInfoPanel employees={getFilteredEmployees()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
