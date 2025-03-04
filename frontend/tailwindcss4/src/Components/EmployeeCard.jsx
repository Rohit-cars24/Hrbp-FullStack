import React from "react";

const EmployeeCard = ({ employee }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
          <p className="text-gray-600">
            {employee.department}
          </p>
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
  );
};

export default EmployeeCard;