
import React from 'react';

const StatusTracker = ({ currentStatus }) => {
  const statuses = [
    { name: "To Do", color: "bg-indigo-300" },
    { name: "In Progress", color: "bg-blue-300" },
    { name: "Submitted", color: "bg-cyan-300" },
    { name: "Under Review", color: "bg-teal-300" },
    { name: "Pending HR Review", color: "bg-emerald-300" },
    { name: "Under HR Review", color: "bg-green-300" },
    { name: "Completed", color: "bg-lime-300" }
  ];

  const getStatusIndex = (status) => {
    return statuses.findIndex(item => item.name === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-11/12 mb-10 px-2 mt-4 ml-14">
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
              background: 'linear-gradient(to right, #a3bffa, #7dd3fc, #81e6d9, #34d399, #d9f99d)' // lighter gradient
            }}
          />
        </div>

        <div className="absolute -top-1 w-full flex justify-between">
          {statuses.map((status, index) => (
            <div
              key={status.name}
              className="relative group"
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
                    ? 'text-gray-900 font-semibold' 
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
