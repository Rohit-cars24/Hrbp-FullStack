import React, { useState, useEffect } from "react";
import axios from "axios";

// Import components
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import FilterBar from "../components/FilterBar";
import LeaveRequestsPanel from "../components/LeaveRequestsPanel";
import EmployeeInfoPanel from "../components/EmployeeInfoPanel";

const EmployeeDashboard = () => {
  const [employeeName, setemployeeName] = useState("Sam Wilson");
  const [teamMembers, setTeamMembers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employee data on component mount
  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("Authorization");

        // Fetch employee name and info
        const employeeResponse = await axios.get(
          `http://localhost:8080/users/${userId}`,
          { headers: { Authorization: token } }
        );

        if (employeeResponse.data) {
          setemployeeName(employeeResponse.data.name || "employee");
        }

        // Fetch team members
        const teamResponse = await axios.get(
          "http://localhost:8080/users/team-members",
          { headers: { Authorization: token } }
        );

        if (teamResponse.data) {
          setTeamMembers(teamResponse.data);
        }

        // Fetch leave requests for team members only
        const leaveResponse = await axios.get(
          "http://localhost:8080/leave/team-requests",
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
      if (teamMembers.length === 0) {
        setTeamMembers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            department: "Engineering",
            position: "Senior Developer",
            joinDate: "2023-01-15",
            projects: ["Web App Redesign", "API Integration"],
          },
          {
            id: 2,
            name: "Shreyas",
            email: "shreyas@example.com",
            department: "Engineering",
            position: "Junior Developer",
            joinDate: "2023-05-15",
            projects: ["Bug Fixes", "Documentation"],
          },
          {
            id: 3,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            department: "Engineering",
            position: "QA Engineer",
            joinDate: "2023-03-10",
            projects: ["Testing Automation", "Web App Redesign"],
          },
          // ... other team member data
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
            impact: "Medium - Will miss sprint planning",
          },
          {
            id: 102,
            employeeId: 2,
            employeeName: "Shreyas",
            type: "Vacation",
            startDate: "2025-03-15",
            endDate: "2025-03-22",
            status: "Pending",
            impact: "Low - Tasks already assigned to backup",
          },
          {
            id: 103,
            employeeId: 3,
            employeeName: "Sarah Johnson",
            type: "Personal Leave",
            startDate: "2025-03-05",
            endDate: "2025-03-07",
            status: "Approved",
            impact: "Low - No critical deadlines",
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
          employee.email.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query) ||
          (employee.projects &&
            employee.projects.some((project) =>
              project.toLowerCase().includes(query)
            ))
      );
    }

    return filtered;
  };

  // Action handlers
  const handleApproveLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem("Authorization");
      await axios.put(
        `http://localhost:8080/leave/approve/${leaveId}`,
        {},
        { headers: { Authorization: token } }
      );

      // Update local state
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === leaveId ? { ...request, status: "Approved" } : request
        )
      );
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem("Authorization");
      await axios.put(
        `http://localhost:8080/leave/reject/${leaveId}`,
        {},
        { headers: { Authorization: token } }
      );

      // Update local state
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === leaveId ? { ...request, status: "Rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const handleAssignProject = () => {
    window.location.href = "/assign-project";
  };

  const handlePerformanceReview = () => {
    window.location.href = "/performance-reviews";
  };

  const handleTeamCalendar = () => {
    window.location.href = "/team-calendar";
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-blue-100 fixed inset-0 text-white">
      <div className="relative z-10 flex flex-col min-h-screen p-4 lg:p-6 w-full overflow-hidden">
        <Header
          userName={employeeName}
          title="Autonaut Employee Portal"
          userRole="Employee"
        />

        <FilterBar
          employees={teamMembers}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          employeeFilter={employeeFilter}
          setEmployeeFilter={setEmployeeFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholderText="Search by name, position or project..."
        />

     
        <EmployeeInfoPanel
            employees={getFilteredTeamMembers()}
            title="Team Members"
            showProjects={true}
        />

      </div>
    </div>
  );
};

export default EmployeeDashboard;
