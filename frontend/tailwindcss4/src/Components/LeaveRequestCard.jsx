import React from "react";
import StatusBadge from "./StatusBadge";

const LeaveRequestCard = ({ request }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
        <StatusBadge status={request.status} />
      </div>
    </div>
  );
};

export default LeaveRequestCard;