//Status Tracker

import React from 'react';

const StatusTracker = ({ currentStatus }) => {
  const statuses = [
    { name: "To Do", color: "bg-indigo-600" },
    { name: "In Progress", color: "bg-blue-600" },
    { name: "Submitted", color: "bg-cyan-600" },
    { name: "Under Review", color: "bg-teal-600" },
    { name: "Pending HR Review", color: "bg-emerald-600" },
    { name: "Under HR Review", color: "bg-green-600" },
    { name: "Completed", color: "bg-lime-600" }
  ];

  const getStatusIndex = (status) => {
    return statuses.findIndex(item => item.name === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-11/12 mb-12 px-2 pt-1 ml-14">
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
              background: 'linear-gradient(to right, #4f46e5, #0284c7, #0d9488, #059669, #65a30d)'
            }}
          />
        </div>

        <div className="absolute -top-1 w-full flex justify-between">
          {statuses.map((status, index) => (
            <div
              key={status.name}
              className="relative group "
            >
             
              <div 
                className={`w-4 h-4 rounded-full ${
                  index <= currentIndex 
                    ? status.color
                    : 'bg-gray-200'
                } border-2 border-white shadow transition-all duration-300 
                ${index <= currentIndex ? 'scale-110' : ''}`}
              />
              
              <div className="absolute transform -translate-x-1/2 left-1/2 mt-2">
                <div 
                  className={`whitespace-nowrap px-1.5 py-0.5 rounded text-sm
                  ${index <= currentIndex 
                    ? 'text-gray-900 font-bold' 
                    : 'text-gray-600'
                  } transition-all duration-300`}
                >
                  {status.name}
                </div>
              </div>
              
              <div className="absolute -inset-2 bg-gray-50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;