import React from "react";
import { Users } from "lucide-react";
import EmployeeCard from "./EmployeeCard";
import { useNavigate } from "react-router-dom";

const EmployeeInfoPanel = ({ employees }) => {
  
  const navigate = useNavigate();

  const userId = localStorage.getItem("userid");
  const role = localStorage.getItem("Role");
  
  const showMonthCalender = () => {
    if(role === "ROLE_HR") navigate(`/hr/monthly/${userId}/Mar-2025`);
    else navigate(`/manager/monthly/${userId}/Mar-2025`);
  };

  return (
    <div className="bg-white rounded-lg p-4 overflow-hidden flex flex-col shadow-sm flex-1 max-h-full">
      {/* Header with Employee Information and View Month Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Users size={20} className="mr-2 text-blue-600" />
          Employee Information
        </h2>
        <button 
        onClick={showMonthCalender}
        className="px-4 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition">
          View Month
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-500
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400"
      >
        <div
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
          style={{
            scrollbarColor: "#D1D5DB #F3F4F6",
            scrollbarWidth: "thin",
          }}
        >
          {employees.length > 0 ? (
            employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
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
  );
};

export default EmployeeInfoPanel;
