import React, { useState } from 'react';
import { Search, User } from 'lucide-react';

const TeamMembersDisplay = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" bg-white shadow-lg rounded-lg  ">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
          <User className="h-4 w-4 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-600">Team Members</h2>
          </div>
          <span className="text-orange-600 text-sm font-medium">
            Total: {filteredEmployees.length}
          </span>
        </div>

        {/* Search Bar */}
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

        {/* Team Members List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredEmployees
          .sort((a, b) => a.empName.localeCompare(b.empName))
          .map((emp, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                {getInitials(emp.empName)}
              </div>
              <div className="ml-3">
                <div className="font-medium text-blue-800">{emp.empName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersDisplay;