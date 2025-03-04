import React, { useState } from 'react';
import axios from 'axios';

const ByMonth = ({ userType = "hr" }) => {
  const [monthYear, setMonthYear] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inline styles
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '24px',
    },
    title: {
      margin: '0 0 16px 0',
      color: '#333',
      fontWeight: 600,
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'flex-end',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      color: '#555',
      fontWeight: 500,
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '15px',
      minWidth: '180px',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 18px',
      fontSize: '15px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
    errorMessage: {
      color: '#e74c3c',
      backgroundColor: '#fadbd8',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '15px',
    },
    calendarContent: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    calendarTitle: {
      backgroundColor: '#f8f9fa',
      padding: '16px 24px',
      borderBottom: '1px solid #e9ecef',
    },
    calendarTitleText: {
      margin: 0,
      color: '#2c3e50',
      fontWeight: 600,
      fontSize: '20px',
    },
    calendarWrapper: {
      overflowX: 'auto',
      padding: '0 3px 3px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px',
    },
    th: {
      backgroundColor: '#f8f9fa',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      border: '1px solid #e9ecef',
      textAlign: 'center',
      padding: 0,
    },
    td: {
      border: '1px solid #e9ecef',
      textAlign: 'center',
      padding: 0,
    },
    userCell: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: 500,
      position: 'sticky',
      left: 0,
      backgroundColor: '#fff',
      zIndex: 5,
      minWidth: '180px',
      borderRight: '2px solid #e9ecef',
    },
    userCellHeader: {
      backgroundColor: '#f8f9fa',
      zIndex: 15,
    },
    dateCell: {
      padding: '0',
      minWidth: '70px',
    },
    dateDisplay: {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 0',
    },
    dayName: {
      fontSize: '12px',
      color: '#6c757d',
      fontWeight: 'normal',
    },
    dayNumber: {
      fontSize: '16px',
      fontWeight: 500,
      marginTop: '2px',
    },
    statusCell: {
      height: '48px',
      fontWeight: 500,
      transition: 'transform 0.1s',
    },
    statusCellHover: {
      transform: 'scale(1.1)',
      zIndex: 20,
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    },
    legendContainer: {
      padding: '20px 24px',
      borderTop: '1px solid #e9ecef',
    },
    legendTitle: {
      margin: '0 0 12px 0',
      fontSize: '16px',
      color: '#2c3e50',
    },
    legendItems: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '10px',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    legendMarker: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    // Status cell background colors
    plannedLeave: { backgroundColor: '#bbdefb' },
    unplannedLeave: { backgroundColor: '#ffcdd2' },
    plannedHalf: { backgroundColor: '#c8e6c9' },
    sickLeave: { backgroundColor: '#ffe0b2' },
    workFromHome: { backgroundColor: '#e1bee7' },
    travel: { backgroundColor: '#d1c4e9' },
    holiday: { backgroundColor: '#b3e5fc' },
    elections: { backgroundColor: '#f0f4c3' },
    joined: { backgroundColor: '#b2dfdb' },
    present: { backgroundColor: '#f5f5f5' },
  };

  // Function to get the endpoint based on user type
  const getEndpoint = () => {
    return `/${userType}/bymonth`;
  };

  // Legend of attendance codes and their meanings
  const attendanceCodes = {
    "P": "Planned Leave",
    "U": "Unplanned Leave",
    "P*": "Planned Leave (Second Half)",
    "S": "Sick Leave",
    "W": "Work From Home",
    "T": "Travelling to HQ",
    "H": "Holiday",
    "E": "Elections",
    "J": "Joined",
    "P**": "Planned Leave (First Half)",
    "": "Present"
  };

  // Function to generate calendar days
  const generateCalendarDays = (data) => {
    if (!data) return [];
    
    // Extract all unique dates from the data
    const allDates = new Set();
    Object.values(data).forEach(dateMap => {
      Object.keys(dateMap).forEach(date => allDates.add(date));
    });
    
    // Convert to array and sort by date
    return Array.from(allDates).sort((a, b) => {
      const monthMap = {
        "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
        "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
      };
      
      const [monthA, dayA] = a.split('-');
      const [monthB, dayB] = b.split('-');
      
      const monthDiff = monthMap[monthA] - monthMap[monthB];
      if (monthDiff !== 0) return monthDiff;
      
      return parseInt(dayA) - parseInt(dayB);
    });
  };

  // Function to fetch attendance data
  const fetchAttendanceData = async () => {
    if (!monthYear || !monthYear.match(/^\d{4}-\d{2}$/)) {
      setError('Please enter a valid month and year in YYYY-MM format');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(getEndpoint(), {
        params: { monthYear }
      });
      
      setAttendanceData(response.data);
    } catch (err) {
      setError(`Error fetching attendance data: ${err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the day of week from date
  const getDayOfWeek = (dateStr) => {
    const [month, day] = dateStr.split('-');
    const monthMap = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    
    // We'll use the current year for simplicity, since we only need the day of week
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, monthMap[month], parseInt(day));
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Function to handle month year change
  const handleMonthYearChange = (e) => {
    setMonthYear(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  // Function to determine cell color based on attendance code
  const getCellStyleForCode = (code) => {
    switch(code) {
      case 'P': return styles.plannedLeave;
      case 'U': return styles.unplannedLeave;
      case 'P*': 
      case 'P**': return styles.plannedHalf;
      case 'S': return styles.sickLeave;
      case 'W': return styles.workFromHome;
      case 'T': return styles.travel;
      case 'H': return styles.holiday;
      case 'E': return styles.elections;
      case 'J': return styles.joined;
      default: return styles.present;
    }
  };

  // Function to generate month name from YYYY-MM format
  const getMonthName = (monthYearStr) => {
    if (!monthYearStr || !monthYearStr.match(/^\d{4}-\d{2}$/)) return '';
    
    const monthMap = {
      '01': 'January', '02': 'February', '03': 'March', '04': 'April',
      '05': 'May', '06': 'June', '07': 'July', '08': 'August',
      '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    
    const [year, month] = monthYearStr.split('-');
    return `${monthMap[month]} ${year}`;
  };

  // Get sorted usernames and calendar days
  const usernames = attendanceData ? Object.keys(attendanceData).sort() : [];
  const calendarDays = attendanceData ? generateCalendarDays(attendanceData) : [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Attendance Calendar</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="monthYear" style={styles.label}>Month and Year:</label>
            <input
              type="text"
              id="monthYear"
              placeholder="YYYY-MM"
              value={monthYear}
              onChange={handleMonthYearChange}
              required
              pattern="\d{4}-\d{2}"
              title="Please use YYYY-MM format (e.g. 2023-03)"
              style={styles.input}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? 'Loading...' : 'Generate Calendar'}
          </button>
        </form>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {attendanceData && (
        <div style={styles.calendarContent}>
          <div style={styles.calendarTitle}>
            <h2 style={styles.calendarTitleText}>{getMonthName(monthYear)} Attendance</h2>
          </div>
          
          <div style={styles.calendarWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{...styles.th, ...styles.userCell, ...styles.userCellHeader}}>Employee</th>
                  {calendarDays.map(day => (
                    <th key={day} style={{...styles.th, ...styles.dateCell}}>
                      <div style={styles.dateDisplay}>
                        <span style={styles.dayName}>{getDayOfWeek(day)}</span>
                        <span style={styles.dayNumber}>{day.split('-')[1]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usernames.map(username => (
                  <tr key={username}>
                    <td style={{...styles.td, ...styles.userCell}}>{username}</td>
                    {calendarDays.map(day => {
                      const status = attendanceData[username][day] || "";
                      return (
                        <td 
                          key={`${username}-${day}`}
                          style={{
                            ...styles.td, 
                            ...styles.statusCell,
                            ...getCellStyleForCode(status)
                          }}
                          title={attendanceCodes[status]}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.zIndex = 20;
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.zIndex = 'auto';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {status}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.legendContainer}>
            <h3 style={styles.legendTitle}>Legend</h3>
            <div style={styles.legendItems}>
              {Object.entries(attendanceCodes).map(([code, description]) => (
                <div key={code} style={styles.legendItem}>
                  <span style={{
                    ...styles.legendMarker,
                    ...getCellStyleForCode(code)
                  }}>
                    {code || "✓"}
                  </span>
                  <span>{description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ByMonth;