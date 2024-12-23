

import React, { useState } from 'react';
import { Search, User } from 'lucide-react';

const TeamMembersDisplay = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const colorPairs = [
    ['bg-blue-100', 'text-blue-600'],
    ['bg-purple-100', 'text-purple-600'],
    ['bg-green-100', 'text-green-600'],
    ['bg-rose-100', 'text-rose-600'],
    ['bg-amber-100', 'text-amber-600'],
    ['bg-teal-100', 'text-teal-600'],
    ['bg-indigo-100', 'text-indigo-600'],
    ['bg-pink-100', 'text-pink-600'],
    ['bg-cyan-100', 'text-cyan-600'],
    ['bg-orange-100', 'text-orange-600'],
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getColorPair = (name) => {
    const index = name.length % colorPairs.length;
    return colorPairs[index];
  };

  const filteredEmployees = employees.filter(emp =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-600">Team Members</h2>
          </div>
          <span className="text-orange-600 text-sm font-medium">
            Total: {filteredEmployees.length}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
          {filteredEmployees
            .sort((a, b) => a.empName.localeCompare(b.empName))
            .map((emp, index) => {
              const [bgColor, textColor] = getColorPair(emp.empName);
              return (
                <div
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${bgColor} ${textColor}`}>
                    {getInitials(emp.empName)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-800">{emp.empName}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersDisplay;