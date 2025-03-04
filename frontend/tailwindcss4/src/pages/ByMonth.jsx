import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ByMonth = () => {
    const [monthYear, setMonthYear] = useState('');
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (event) => {
        setMonthYear(event.target.value);
    };

    const fetchReportData = async () => {
        if (!monthYear || !monthYear.match(/^\d{4}-\d{2}$/)) {
            setError('Please enter a valid month and year (YYYY-MM).');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('Authorization');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:8080/hr/bymonth?monthYear=${monthYear}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && Object.keys(response.data).length > 0) {
                setReportData(response.data);
            } else {
                setError('No data found for the specified month and year.');
            }
        } catch (err) {
            setError(err.response?.status === 401 
                ? 'Your session has expired. Please log in again.' 
                : 'Failed to load attendance data. Please try again.');
            
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceColor = (code) => {
        switch(code) {
            case "P": return "#4CAF50"; // Planned Leave
            case "U": return "#F44336"; // Unplanned Leave
            case "P*": return "#8BC34A"; // Planned Leave (Second Half)
            case "S": return "#FF9800"; // Sick Leave
            case "W": return "#2196F3"; // Work From Home
            case "T": return "#9C27B0"; // Travelling to HQ
            case "H": return "#E91E63"; // Holiday
            case "E": return "#607D8B"; // Elections
            case "J": return "#00BCD4"; // Joined
            case "P**": return "#CDDC39"; // Planned Leave (First Half)
            default: return "#EEEEEE"; // Default/Empty
        }
    };

    const getAttendanceTooltip = (code) => {
        switch(code) {
            case "P": return "Planned Leave";
            case "U": return "Unplanned Leave";
            case "P*": return "Planned Leave (Second Half)";
            case "S": return "Sick Leave";
            case "W": return "Work From Home";
            case "T": return "Travelling to HQ";
            case "H": return "Holiday";
            case "E": return "Elections";
            case "J": return "Joined";
            case "P**": return "Planned Leave (First Half)";
            default: return "";
        }
    };

    const generateCalendar = () => {
        if (!reportData) return null;

        const month = parseInt(monthYear.split('-')[1]);
        const year = parseInt(monthYear.split('-')[0]);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Get days of week for column headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Generate dates in the format used by the API
        const dates = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month - 1, i + 1);
            return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).replace(' ', '-');
        });

        // Get day of week for each date to show weekends differently
        const dayOfWeeks = dates.map((_, i) => {
            const date = new Date(year, month - 1, i + 1);
            return date.getDay(); // 0 for Sunday, 6 for Saturday
        });

        const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <h2>{monthName} {year} Attendance</h2>
                    <div className="legend">
                        <h4>Legend:</h4>
                        <div className="legend-items">
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
                                { code: "P**", label: "Planned Leave (First Half)" }
                            ].map(item => (
                                <div key={item.code} className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: getAttendanceColor(item.code) }}></span>
                                    <span className="legend-code">{item.code}</span>
                                    <span className="legend-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="calendar-table-container">
                    <table className="calendar-table">
                        <thead>
                            <tr>
                                <th className="username-cell">User Name</th>
                                {dates.map((date, index) => (
                                    <th 
                                        key={date} 
                                        className={`date-cell ${[0, 6].includes(dayOfWeeks[index]) ? 'weekend' : ''}`}
                                    >
                                        <div className="date-number">{date.split('-')[1]}</div>
                                        <div className="date-day">{weekdays[dayOfWeeks[index]]}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(reportData).map(([username, attendance]) => (
                                <tr key={username}>
                                    <td className="username-cell">{username}</td>
                                    {dates.map((date, index) => {
                                        const attendanceCode = attendance[date] || '';
                                        return (
                                            <td 
                                                key={date} 
                                                className={`code-cell ${[0, 6].includes(dayOfWeeks[index]) ? 'weekend' : ''}`}
                                                style={{ 
                                                    backgroundColor: attendanceCode ? getAttendanceColor(attendanceCode) : '',
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

    return (
        <div className="attendance-page">
            <div className="attendance-container">
                <div className="page-header">
                    <h1>Attendance Report</h1>
                    <div className="input-group">
                        <input
                            type="month"
                            id="monthYear"
                            value={monthYear}
                            onChange={handleInputChange}
                            placeholder="YYYY-MM"
                        />
                        <button 
                            className={`fetch-button ${loading ? 'loading' : ''}`}
                            onClick={fetchReportData}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Generate Report'}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
                
                {reportData ? generateCalendar() : (
                    <div className="placeholder-message">
                        {loading ? 
                            'Loading attendance data...' : 
                            'Enter a month and year to generate the attendance report.'}
                    </div>
                )}
                
                <style jsx>{`
                    .attendance-page {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem;
                        background-color: #f8fafc;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    }
                    
                    .attendance-container {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }
                    
                    .page-header {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    
                    h1 {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #1e293b;
                        margin: 0;
                    }
                    
                    .input-group {
                        display: flex;
                        gap: 0.75rem;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    
                    input[type="month"] {
                        padding: 0.75rem 1rem;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 1rem;
                        outline: none;
                        transition: border-color 0.2s, box-shadow 0.2s;
                        background-color: white;
                    }
                    
                    input[type="month"]:focus {
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                    }
                    
                    .fetch-button {
                        padding: 0.75rem 1.5rem;
                        background-color: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    
                    .fetch-button:hover {
                        background-color: #2563eb;
                    }
                    
                    .fetch-button.loading {
                        background-color: #93c5fd;
                        cursor: not-allowed;
                    }
                    
                    .error-message {
                        color: #ef4444;
                        background-color: #fee2e2;
                        padding: 0.75rem 1rem;
                        border-radius: 8px;
                        font-size: 0.875rem;
                        margin-top: 0.5rem;
                    }
                    
                    .placeholder-message {
                        text-align: center;
                        padding: 4rem 0;
                        color: #6b7280;
                    }
                    
                    .calendar-container {
                        background-color: white;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }
                    
                    .calendar-header {
                        padding: 1.5rem;
                        background-color: #f1f5f9;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .calendar-header h2 {
                        margin: 0 0 1rem 0;
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #1e293b;
                    }
                    
                    .legend {
                        margin-top: 1rem;
                    }
                    
                    .legend h4 {
                        margin: 0 0 0.75rem 0;
                        font-size: 1rem;
                        font-weight: 500;
                    }
                    
                    .legend-items {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                    
                    .legend-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                    }
                    
                    .legend-color {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border-radius: 4px;
                    }
                    
                    .legend-code {
                        font-weight: 500;
                    }
                    
                    .calendar-table-container {
                        overflow-x: auto;
                    }
                    
                    .calendar-table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                    }
                    
                    .calendar-table th, .calendar-table td {
                        text-align: center;
                        font-size: 0.875rem;
                    }
                    
                    .calendar-table th {
                        position: sticky;
                        top: 0;
                        background-color: #f8fafc;
                        z-index: 10;
                        padding: 0.75rem 0.5rem;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .username-cell {
                        text-align: left;
                        padding: 0.75rem 1rem;
                        font-weight: 500;
                        position: sticky;
                        left: 0;
                        background-color: white;
                        z-index: A5;
                        min-width: 150px;
                        max-width: 200px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        border-right: 1px solid #e2e8f0;
                    }
                    
                    th.username-cell {
                        background-color: #f8fafc;
                        z-index: 20;
                    }
                    
                    .date-cell {
                        min-width: 60px;
                        vertical-align: middle;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .date-number {
                        font-weight: 600;
                    }
                    
                    .date-day {
                        font-size: 0.75rem;
                        color: #64748b;
                        margin-top: 0.25rem;
                    }
                    
                    .code-cell {
                        padding: 0.75rem 0.5rem;
                        font-weight: 600;
                        cursor: default;
                        transition: transform 0.1s;
                        height: 50px;
                    }
                    
                    .code-cell:hover {
                        transform: scale(1.1);
                        z-index: 25;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    
                    .weekend {
                        background-color: #f1f5f9;
                    }
                    
                    tbody tr:nth-child(even) td:not(.code-cell) {
                        background-color: #f8fafc;
                    }
                    
                    tbody tr:hover td:not(.code-cell, [style*="background-color"]) {
                        background-color: #e0f2fe;
                    }
                    
                    @media (max-width: 768px) {
                        .attendance-page {
                            padding: 1rem;
                        }
                        
                        .input-group {
                            flex-direction: column;
                            align-items: stretch;
                        }
                        
                        .legend-items {
                            gap: 0.75rem;
                        }
                        
                        .legend-item {
                            font-size: 0.75rem;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ByMonth;