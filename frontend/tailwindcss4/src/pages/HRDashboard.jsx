import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCog,
  Lock,
  Search,
  Calendar,
  LogOut,
  ChevronDown,
  Filter,
} from "lucide-react";
import axios from "axios";
import loginImage from "../assets/logo3.png";

const HRDashboard = () => {
  const [hrName, setHrName] = useState("Alex Johnson");
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

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
            name: "Jane Smith",
            email: "jane@example.com",
            department: "Marketing",
            position: "Manager",
            joinDate: "2022-11-03",
          },
          {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            department: "Finance",
            position: "Accountant",
            joinDate: "2024-01-20",
          },
          {
            id: 4,
            name: "Emily Davis",
            email: "emily@example.com",
            department: "HR",
            position: "Recruiter",
            joinDate: "2023-08-12",
          },
          {
            id: 5,
            name: "Michael Wilson",
            email: "michael@example.com",
            department: "Engineering",
            position: "QA Engineer",
            joinDate: "2022-06-30",
          },
          {
            id: 6,
            name: "Sarah Brown",
            email: "sarah@example.com",
            department: "Sales",
            position: "Sales Executive",
            joinDate: "2023-02-15",
          },
          {
            id: 7,
            name: "David Miller",
            email: "david@example.com",
            department: "Product",
            position: "Product Manager",
            joinDate: "2022-09-12",
          },
          {
            id: 8,
            name: "Jessica Taylor",
            email: "jessica@example.com",
            department: "Engineering",
            position: "Frontend Developer",
            joinDate: "2023-07-19",
          },
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
            employeeName: "Jane Smith",
            type: "Vacation",
            startDate: "2025-04-05",
            endDate: "2025-04-15",
            status: "Approved",
          },
          {
            id: 103,
            employeeId: 3,
            employeeName: "Robert Johnson",
            type: "Personal Leave",
            startDate: "2025-03-22",
            endDate: "2025-03-22",
            status: "Pending",
          },
          {
            id: 104,
            employeeId: 5,
            employeeName: "Michael Wilson",
            type: "Sick Leave",
            startDate: "2025-03-07",
            endDate: "2025-03-08",
            status: "Rejected",
          },
          {
            id: 105,
            employeeId: 6,
            employeeName: "Sarah Brown",
            type: "Vacation",
            startDate: "2025-03-15",
            endDate: "2025-03-20",
            status: "Pending",
          },
          {
            id: 106,
            employeeId: 7,
            employeeName: "David Miller",
            type: "Personal Leave",
            startDate: "2025-03-05",
            endDate: "2025-03-05",
            status: "Approved",
          },
        ]);
      }
    }, 1000);
  }, []);

  // Handle navigation to create user page
  const handleCreateUser = () => {
    window.location.href = "/create-user";
  };

  // Handle navigation to update user page
  const handleUpdateUser = () => {
    window.location.href = "/update-user";
  };

  // Handle navigation to update password page
  const handleUpdatePassword = () => {
    window.location.href = "/update-password";
  };

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
    if (!employeeFilter) return employees;

    return employees.filter(
      (employee) => employee.id.toString() === employeeFilter
    );
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Months for dropdown
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-blue-100 fixed inset-0 text-white ">
      {/* Main Content - Full Screen Width */}
      <div className="relative z-10 flex flex-col min-h-screen p-4 lg:p-6 w-full">
        {/* Header */}
        <header className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center w-full shadow-sm">
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center justify-center">
              <img
                className="h-16 w-auto mr-2"
                src={loginImage}
                alt="Company logo"
              />
              <h className="pl-85 text-4xl font-bold text-gray-800">
                Autonaut HR Portal
              </h>
            </div>
            <p className="text-gray-600 pl-125">Welcome back, {hrName}!</p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center text-white">
              <LogOut size={16} className="mr-1" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Buttons */}
        <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap justify-center gap-4 w-full shadow-sm">
          <button
            onClick={handleCreateUser}
            className="flex-1 min-w-44 p-4 bg-blue-400 rounded-lg text-white flex flex-col items-center justify-center transition-all hover:bg-blue-600"
          >
            <UserPlus size={24} />
            <span className="mt-2 font-medium">Create User</span>
          </button>

          <button
            onClick={handleUpdateUser}
            className="flex-1 min-w-44 p-4 bg-purple-500 rounded-lg text-white flex flex-col items-center justify-center transition-all hover:bg-purple-600"
          >
            <UserCog size={24} />
            <span className="mt-2 font-medium">Update User</span>
          </button>

          <button
            onClick={handleUpdatePassword}
            className="flex-1 min-w-44 p-4 bg-cyan-500 rounded-lg text-white flex flex-col items-center justify-center transition-all hover:bg-cyan-600"
          >
            <Lock size={24} />
            <span className="mt-2 font-medium">Update Password</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center w-full shadow-sm">
          <div className="text-gray-700 flex items-center">
            <Filter size={18} className="mr-2" />
            <span>Filters:</span>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center text-gray-700"
            >
              <Calendar size={16} className="mr-2 text-gray-600" />
              <span>
                {monthFilter
                  ? months.find((m) => m.value === monthFilter)?.label
                  : "Filter by Month"}
              </span>
              <ChevronDown size={16} className="ml-2" />
            </button>

            {showMonthDropdown && (
              <div className="absolute z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setMonthFilter("");
                      setShowMonthDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Clear Filter
                  </button>
                  {months.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        setMonthFilter(month.value);
                        setShowMonthDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Employee Filter */}
          <div className="relative">
            <button
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center text-gray-700"
            >
              <Users size={16} className="mr-2 text-gray-600" />
              <span>
                {employeeFilter
                  ? employees.find((e) => e.id.toString() === employeeFilter)
                      ?.name || "Filter by Employee"
                  : "Filter by Employee"}
              </span>
              <ChevronDown size={16} className="ml-2" />
            </button>

            {showEmployeeDropdown && (
              <div className="absolute z-20 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setEmployeeFilter("");
                      setShowEmployeeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    All Employees
                  </button>
                  {employees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => {
                        setEmployeeFilter(employee.id.toString());
                        setShowEmployeeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {employee.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search box */}
          <div className="flex-1 min-w-52">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full py-2 pl-10 pr-4 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Main Grid - Full Width */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Leave Requests Section */}
          <div className="bg-white rounded-lg p-4 overflow-hidden flex flex-col shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Calendar size={20} className="mr-2 text-blue-600" />
              Leave Requests
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {getFilteredLeaveRequests().length > 0 ? (
                getFilteredLeaveRequests().map((request) => (
                  <div
                    key={request.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-black">
                          {request.employeeName}
                        </h3>
                        <p className="text-gray-600">{request.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Calendar size={48} className="mb-2 opacity-50" />
                  <p>No leave requests found</p>
                </div>
              )}
            </div>
          </div>

          {/* Employee Information Section */}
          <div className="bg-white rounded-lg p-4 overflow-hidden flex flex-col shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Users size={20} className="mr-2 text-blue-600" />
              Employee Information
            </h2>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {getFilteredEmployees().length > 0 ? (
                  getFilteredEmployees().map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                          <span className="text-lg font-bold">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg text-black">
                            {employee.name}
                          </h3>
                          <p className="text-blue-600">{employee.position}</p>
                          <p className="text-gray-600">{employee.department}</p>
                          <p className="text-sm text-gray-500">
                            {employee.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Joined:{" "}
                            {new Date(employee.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white">
                          View Profile
                        </button>
                        <button className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded text-white">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                    <Users size={48} className="mb-2 opacity-50" />
                    <p>No employees found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
