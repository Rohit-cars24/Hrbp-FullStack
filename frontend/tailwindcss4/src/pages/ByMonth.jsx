import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ByMonth = () => {
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { userid, month } = useParams(); // Extract parameters from the URL

  // Convert the month-year format from the URL (Mar-2025) to the format needed by the API (YYYY-MM)
  const getFormattedMonthYear = () => {
    if (!month) return "";

    const [monthName, year] = month.split("-");

    // Get month number from name (Mar -> 03)
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const monthNum = monthMap[monthName];

    if (!monthNum || !year) return "";

    return `${year}-${monthNum}`;
  };

  // Get month number from month name
  const getMonthNumber = (monthName) => {
    const monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    return monthMap[monthName];
  };

  // Format date to the format we need for URL (Mon-YYYY)
  const formatMonthForUrl = (date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
  };

  // Handle navigation to previous and next months
  const navigateToMonth = (direction) => {
    const [monthName, yearStr] = month.split("-");
    const year = parseInt(yearStr);
    const monthNum = getMonthNumber(monthName);

    let newDate;
    if (direction === "prev") {
      // For previous month
      newDate = new Date(year, monthNum - 1, 1);
    } else {
      // For next month
      newDate = new Date(year, monthNum + 1, 1);
    }

    const newMonthYear = formatMonthForUrl(newDate);
    navigate(`/hr/monthly/${userid}/${newMonthYear}`);
  };

  // Jump to a specific month
  const jumpToMonth = (event) => {
    const selectedMonthYear = event.target.value; // Format: 2025-03
    const [year, monthNum] = selectedMonthYear.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(monthNum) - 1];
    navigate(`/hr/monthly/${userid}/${monthName}-${year}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch data as soon as component loads or route changes
    fetchReportData();
  }, [location.pathname]); // Re-fetch when the path changes

  const fetchReportData = async () => {
    const monthYear = getFormattedMonthYear();

    if (!monthYear) {
      setError("Invalid month format in URL. Expected format: Mar-2025");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/hr/bymonth?monthYear=${monthYear}&userid=${userid}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Object.keys(response.data).length > 0) {
        setReportData(response.data);
      } else {
        setError("No data found for the specified month and year.");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Your session has expired. Please log in again."
          : "Failed to load attendance data. Please try again."
      );

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (code) => {
    switch (code) {
      case "P":
        return "#4CAF50"; // Planned Leave
      case "U":
        return "#F44336"; // Unplanned Leave
      case "P*":
        return "#8BC34A"; // Planned Leave (Second Half)
      case "S":
        return "#FF9800"; // Sick Leave
      case "W":
        return "#2196F3"; // Work From Home
      case "T":
        return "#9C27B0"; // Travelling to HQ
      case "H":
        return "#E91E63"; // Holiday
      case "E":
        return "#607D8B"; // Elections
      case "J":
        return "#00BCD4"; // Joined
      case "P**":
        return "#CDDC39"; // Planned Leave (First Half)
      default:
        return "#EEEEEE"; // Default/Empty
    }
  };

  const getAttendanceTooltip = (code) => {
    switch (code) {
      case "P":
        return "Planned Leave";
      case "U":
        return "Unplanned Leave";
      case "P*":
        return "Planned Leave (Second Half)";
      case "S":
        return "Sick Leave";
      case "W":
        return "Work From Home";
      case "T":
        return "Travelling to HQ";
      case "H":
        return "Holiday";
      case "E":
        return "Elections";
      case "J":
        return "Joined";
      case "P**":
        return "Planned Leave (First Half)";
      default:
        return "";
    }
  };

  const generateCalendar = () => {
    if (!reportData) return null;

    const [year, monthNum] = getFormattedMonthYear().split("-");
    const month = parseInt(monthNum);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get days of week for column headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate dates in the format used by the API
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month - 1, i + 1);
      return date
        .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
        .replace(" ", "-");
    });

    // Get day of week for each date to show weekends differently
    const dayOfWeeks = dates.map((_, i) => {
      const date = new Date(year, month - 1, i + 1);
      return date.getDay(); // 0 for Sunday, 6 for Saturday
    });

    const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
      month: "long",
    });

    return (
        <div className="bg-white rounded-lg shadow flex flex-col h-screen overflow-auto">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-800 m-0 mb-2">
            {monthName} {year} Attendance
          </h2>
          <div className="mt-2">
            <h4 className="text-sm font-medium m-0 mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { code: "P", label: "Planned Leave" },
                { code: "U", label: "Unplanned Leave" },
                { code: "P*", label: "Planned Leave (Second Half)" },
                { code: "S", label: "Sick Leave" },
                { code: "W", label: "Work From Home" },
                { code: "T", label: "Travelling to HQ" },
                { code: "H", label: "Holiday" },
                { code: "E", label: "Elections" },
                { code: "J", label: "Joined" },
              ].map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-1 text-xs"
                >
                  <span
                    className="inline-block w-3 h-3 rounded"
                    style={{ backgroundColor: getAttendanceColor(item.code) }}
                  ></span>
                  <span className="font-medium">{item.code}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>      

        <div className="flex-1 overflow-auto max-h-full">
            <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 bg-slate-50 z-20 text-left py-3 px-4 font-medium border-b border-slate-200">
                  User Name
                </th>
                {dates.map((date, index) => (
                  <th
                    key={date}
                    className={`sticky top-0 bg-slate-50 z-10 text-center py-3 px-2 min-w-[60px] border-b border-slate-200 ${
                      [0, 6].includes(dayOfWeeks[index]) ? "bg-slate-100" : ""
                    }`}
                  >
                    <div className="font-semibold">{date.split("-")[1]}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {weekdays[dayOfWeeks[index]]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData).map(([username, attendance]) => (
                <tr key={username} className="hover:bg-sky-50">
                  <td className="sticky left-0 bg-white z-10 text-left py-3 px-4 font-medium min-w-[150px] max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis border-r border-slate-200">
                    {username}
                  </td>
                  {dates.map((date, index) => {
                    const attendanceCode = attendance[date] || "";
                    return (
                      <td
                        key={date}
                        className={`text-center py-3 px-2 font-semibold cursor-default transition-transform duration-100 hover:scale-110 hover:z-20 hover:shadow-md h-[50px] ${
                          [0, 6].includes(dayOfWeeks[index])
                            ? "bg-slate-100"
                            : ""
                        }`}
                        style={{
                          backgroundColor: attendanceCode
                            ? getAttendanceColor(attendanceCode)
                            : "",
                        }}
                        title={getAttendanceTooltip(attendanceCode)}
                      >
                        {attendanceCode}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Generate a list of months for the dropdown (current year and previous year)
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const options = [];

    // Add months for current year and previous year
    for (let year = currentYear; year >= currentYear - 1; year--) {
      for (let month = 12; month >= 1; month--) {
        const monthStr = month < 10 ? `0${month}` : `${month}`;
        options.push(
          <option key={`${year}-${monthStr}`} value={`${year}-${monthStr}`}>
            {new Date(year, month - 1, 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </option>
        );
      }
    }

    return options;
  };

  return (
    <div className="font-sans text-gray-800 w-full h-screen flex flex-col bg-slate-50 overflow-hidden fixed inset-0">
      <div className="flex flex-col h-full p-8">
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-slate-800 m-0">
                Attendance Report
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="py-2 px-4 bg-slate-200 text-slate-700 border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-300"
              >
                Back
              </button>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-lg text-slate-600">
                User ID: <span className="font-medium">{userid}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Month navigation */}
                <button
                  onClick={() => navigateToMonth("prev")}
                  className="py-2 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-100 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Prev
                </button>

                <select
                  className="py-2 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium cursor-pointer"
                  value={getFormattedMonthYear()}
                  onChange={jumpToMonth}
                >
                  {generateMonthOptions()}
                </select>

                <button
                  onClick={() => navigateToMonth("next")}
                  className="py-2 px-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-slate-100 flex items-center"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 bg-red-100 py-3 px-4 rounded-lg text-sm mt-2">
                {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading attendance data...
            </div>
          ) : reportData ? (
            <div className="h-full">{generateCalendar()}</div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              No attendance data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByMonth;
