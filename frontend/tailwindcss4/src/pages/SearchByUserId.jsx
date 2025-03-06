

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EnhancedCalendarView = () => {
  const { userid, month: routeMonth } = useParams();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(routeMonth || "Mar-2025"); // Default value if no route param
  const [isLoading, setIsLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState("");

  // Function to fetch attendance data
  const fetchAttendanceData = (month) => {
    setIsLoading(true);
    const token = localStorage.getItem("Authorization");

    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login");
      return;
    }

    console.log(month);

    fetch(`http://localhost:8080/hr/${userid}/${month}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data);
        if (data && Object.keys(data).length > 0) {
          setEmployeeName(Object.keys(data)[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendanceData(currentMonth);
  }, [userid, currentMonth, navigate]);

  // Function to get days in month
  const getDaysInMonth = (monthStr) => {
    const [month, year] = monthStr.split("-");
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    const monthIndex = monthMap[month];
    const yearNum = parseInt(year);
    return new Date(yearNum, monthIndex + 1, 0).getDate();
  };

  // Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (monthStr) => {
    const [month, year] = monthStr.split("-");
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    const monthIndex = monthMap[month];
    const yearNum = parseInt(year);
    return new Date(yearNum, monthIndex, 1).getDay();
  };

  // Function to check if a date is a weekend
  const isWeekend = (day, monthStr) => {
    const [month, year] = monthStr.split("-");
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    const monthIndex = monthMap[month];
    const yearNum = parseInt(year);
    const date = new Date(yearNum, monthIndex, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
  };

  // Function to check if a date is today
  const isToday = (day, monthStr) => {
    const today = new Date();
    const [month, year] = monthStr.split("-");
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    const monthIndex = monthMap[month];
    const yearNum = parseInt(year);
    
    return today.getDate() === day && 
           today.getMonth() === monthIndex && 
           today.getFullYear() === yearNum;
  };

  // Function to change month
  const changeMonth = (increment) => {
    const [month, year] = currentMonth.split("-");
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    const reverseMonthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let monthIndex = monthMap[month];
    let yearNum = parseInt(year);
    
    monthIndex += increment;
    
    if (monthIndex > 11) {
      monthIndex = 0;
      yearNum += 1;
    } else if (monthIndex < 0) {
      monthIndex = 11;
      yearNum -= 1;
    }
    
    const newMonth = `${reverseMonthMap[monthIndex]}-${yearNum}`;
    setCurrentMonth(newMonth);
    // Fixed navigation path to include userid
    navigate(`/hr/${userid}/${newMonth}`);
  };
  
  // Sync state when URL changes
  useEffect(() => {
    if (routeMonth && routeMonth !== currentMonth) {
      setCurrentMonth(routeMonth);
    }
  }, [routeMonth, currentMonth]);

  // Function to format date for API
  const formatDateForApi = (day) => {
    const [month, year] = currentMonth.split("-");
    const paddedDay = day < 10 ? `0${day}` : day;
    return `${month}-${paddedDay}`;
  };

  // Status icons and labels

  const getStatusIcon = (status) => {
    const baseIconClass = "w-6 h-6 transition-all duration-300 ease-in-out";
    const textClass = "text-xs font-medium mt-1 transition-all duration-300";
    
    const statusConfig = {
      "W": {
        icon: <svg className={`${baseIconClass} text-blue-600 hover:text-blue-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>,
        label: "WFH",
        textColor: "text-blue-800"
      },
      "P": {
        icon: <svg className={`${baseIconClass} text-amber-600 hover:text-amber-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>,
        label: "PL",
        textColor: "text-amber-800"
      },
      "?": {
        icon: <svg className={`${baseIconClass} text-orange-600 hover:text-orange-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>,
        label: "UL",
        textColor: "text-orange-800"
      },
      "P**": {
        icon: <svg className={`${baseIconClass} text-amber-600 hover:text-amber-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>,
        label: "PL²",
        textColor: "text-amber-800"
      },
      "P*": {
        icon: <svg className={`${baseIconClass} text-amber-600 hover:text-amber-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>,
        label: "PL¹",
        textColor: "text-amber-800"
      },
      "S": {
        icon: <svg className={`${baseIconClass} text-purple-600 hover:text-purple-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>,
        label: "SL",
        textColor: "text-purple-800"
      },
      "T": {
        icon: <svg className={`${baseIconClass} text-indigo-600 hover:text-indigo-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>,
        label: "HQ",
        textColor: "text-indigo-800"
      },
      "H": {
        icon: <svg className={`${baseIconClass} text-teal-600 hover:text-teal-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>,
        label: "HOL",
        textColor: "text-teal-800"
      },
      "E": {
        icon: <svg className={`${baseIconClass} text-cyan-600 hover:text-cyan-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>,
        label: "EL",
        textColor: "text-cyan-800"
      },
      "J": {
        icon: <svg className={`${baseIconClass} text-lime-600 hover:text-lime-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>,
        label: "JOIN",
        textColor: "text-lime-800"
      },
      "Present": {
        icon: <svg className={`${baseIconClass} text-green-600 hover:text-green-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>,
        label: "✓",
        textColor: "text-green-800"
      },
      "A": {
        icon: <svg className={`${baseIconClass} text-red-600 hover:text-red-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>,
        label: "ABS",
        textColor: "text-red-800"
      }
    };
    // Default/fallback icon
    const defaultConfig = {
      icon: <svg className={`${baseIconClass} text-gray-600 hover:text-gray-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>,
      label: "?",
      textColor: "text-gray-600"
    };

    // Normalize the status input
    const normalizedStatus = status.trim();
    
    console.log("Checking status:", normalizedStatus);
    
    const config = statusConfig[normalizedStatus] || defaultConfig;

    return (
      <div className="flex flex-col items-center justify-center group">
        <div className="transform group-hover:scale-110 transition-transform duration-200">
          {config.icon}
        </div>
        <div className={`${textClass} ${config.textColor} font-semibold`}>
          {config.label} 
        </div>
      </div>
    );
};


  // Generate the calendar
  const generateCalendar = () => {
    if (!attendanceData) return null;

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const records = attendanceData[employeeName] || {};

    // Create calendar cells
    let cells = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateForApi(day);
      const status = records[dateStr] || "";
      const weekend = isWeekend(day, currentMonth);
      const today = isToday(day, currentMonth);
      
      // Determine cell styles based on status and day type
      let cellClass = "relative h-24 p-1 border transition-all duration-200 ";
      let dayClass = "absolute top-1 right-2 text-sm ";

      let contentClass = "mt-6 text-center ";
      
      if (today) {
        cellClass += "ring-2 ring-blue-500 ";
        dayClass += "font-bold bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ";
      } else {
        dayClass += "font-medium text-black ";
      }
      
      if (weekend) {
        cellClass += "bg-gray-50 ";
        if (!today) dayClass += "text-gray-500 ";
      } else {
        cellClass += "bg-white ";
      }
      
      // Status-specific styling
      if (status === "WFH") {
        contentClass += "text-blue-800 ";
        if (!weekend) cellClass += "bg-blue-50 hover:bg-blue-100 ";
      } else if (status === "Planned Leave" || status === "Planned Leave (First Half)" || status === "Planned Leave (Second Half)") {
        contentClass += "text-amber-800 ";
        if (!weekend) cellClass += "bg-amber-50 hover:bg-amber-100 ";
      } else if (status === "Unplanned Leave") {
        contentClass += "text-orange-800 ";
        if (!weekend) cellClass += "bg-orange-50 hover:bg-orange-100 ";
      } else if (status === "Sick Leave") {
        contentClass += "text-purple-800 ";
        if (!weekend) cellClass += "bg-purple-50 hover:bg-purple-100 ";
      } else if (status === "Travelling to HQ") {
        contentClass += "text-indigo-800 ";
        if (!weekend) cellClass += "bg-indigo-50 hover:bg-indigo-100 ";
      } else if (status === "Holiday") {
        contentClass += "text-teal-800 ";
        if (!weekend) cellClass += "bg-teal-50 hover:bg-teal-100 ";
      } else if (status === "Elections") {
        contentClass += "text-cyan-800 ";
        if (!weekend) cellClass += "bg-cyan-50 hover:bg-cyan-100 ";
      } else if (status === "Joined") {
        contentClass += "text-lime-800 ";
        if (!weekend) cellClass += "bg-lime-50 hover:bg-lime-100 ";
      } else if (status === "Present") {
        contentClass += "text-green-800 ";
        if (!weekend) cellClass += "bg-green-50 hover:bg-green-100 ";
      } else if (status === "Absent") {
        contentClass += "text-red-800 ";
        if (!weekend) cellClass += "bg-red-50 hover:bg-red-100 ";
      } else {
        // No status
        if (!weekend) cellClass += "hover:bg-gray-100 ";
        contentClass += "text-gray-400 ";
      }
      
      // Hover effect for all cells
      cellClass += "hover:shadow-md ";
      
      cells.push(
        <div key={day} className={cellClass}>
          <div className={dayClass}>{day}</div>
          
          <div className={contentClass}>
            {status ? (
              <>
                {getStatusIcon(status)}
                <div className="text-xs font-medium mt-1">{status}</div>
              </>
            ) : weekend ? (
              <div className="mt-6 text-xs text-gray-400">Weekend</div>
            ) : (
              <div className="text-xs text-gray-400 mt-6">Regular Workday</div>
            )}
          </div>
        </div>
      );
    }
    
    return cells;
  };

  // Function to download attendance report
  const downloadReport = () => {
    const token = localStorage.getItem("Authorization");
    
    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login");
      return;
    }
    
    fetch(`http://localhost:8080/hr/download/${userid}/${currentMonth}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Attendance_${userid}_${currentMonth}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("Error downloading report:", error);
      setError("Failed to download report.");
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-2xl font-bold mb-2 md:mb-0">Attendance Report</h2>
              <div className="flex items-center">
                <div className="flex flex-col text-right">
                  <span className="font-medium text-lg">{employeeName}</span>
                  <span className="text-blue-100 text-sm">Employee ID: {userid}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b bg-white flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <button 
                onClick={() => changeMonth(-1)} 
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Previous month"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <h3 className="text-xl font-medium mx-4 text-black">{currentMonth}</h3>

              <button 
                onClick={() => changeMonth(1)} 
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Next month"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <button 
              onClick={downloadReport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Excel
            </button>
          </div>

          <div className="flex flex-col lg:flex-row p-4">
            {/* Calendar Section */}
            <div className="w-full lg:w-3/4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div 
                        key={day} 
                        className={`text-center py-2 font-semibold ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 border-t border-l">
                    {generateCalendar()}
                  </div>
                </>
              )}
            </div>

            {/* Symbol Details Section */}
            <div className="w-full lg:w-1/4 lg:pl-4 mt-8 lg:mt-0">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Present (✓)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">WFH (W)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Planned Leave (P)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Absent (A)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Unplanned Leave (U)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Sick Leave (S)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Half Day (P*/P**)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Travelling (T)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Holiday (H)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Elections (E)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Joined (J)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCalendarView;

