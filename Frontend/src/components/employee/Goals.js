import React, { useState } from 'react';
import { Target, Users, User } from 'lucide-react';

const PreviousGoalsSection = ({ initialData = {} }) => {
  // Provide default empty data structure
  const defaultYearlyGoals = {
    '2023': {
      managerGoals: [
        { id: 1, title: 'Improve Team Productivity', description: 'Increase team productivity by 20% through process optimization', status: 'Completed', weight: 40 },
        { id: 2, title: 'Skills Development', description: 'Complete advanced certification in relevant technology', status: 'Completed', weight: 40 }
      ],
      teamGoals: [
        { id: 1, title: 'Project Delivery', description: 'Successfully deliver Q4 project milestones', status: 'Completed', weight: 30 },
        { id: 2, title: 'Code Quality', description: 'Maintain 90% code coverage in team projects', status: 'Completed', weight: 30 }
      ],
      employeeGoals: [
        { id: 1, title: 'Learning Goal', description: 'Master new framework through practical application', status: 'Completed', weight: 25 },
        { id: 2, title: 'Collaboration', description: 'Mentor two junior team members', status: 'Completed', weight: 25 }
      ]
    }
  };

  const yearlyGoals = Object.keys(initialData).length > 0 ? initialData : defaultYearlyGoals;
  const [selectedYear, setSelectedYear] = useState(Object.keys(yearlyGoals)[0] || '2023');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under HR Review':
        return 'text-green-500';
      case 'In Progress':
        return 'text-blue-500';
      default:
        return 'text-purple-500';
    }
  };

  const GoalSection = ({ title, icon: Icon, iconColor, goals = [] }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-6 w-6 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold text-gray-800 mb-2">{goal.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                  Status: {goal.status}
                </span>
                <span className="text-sm text-gray-500">Weight: {goal.weight}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-4 text-gray-500">
            No goals found for this category
          </div>
        )}
      </div>
    </div>
  );

  // If no data is available, show a loading or empty state
  if (!yearlyGoals || Object.keys(yearlyGoals).length === 0) {
    return (
      <div className="w-12/12 p-4 bg-white border shadow-md rounded-md ml-4 mr-8 mt-8">
        <h2 className="text-2xl font-bold text-white bg-blue-500 p-2 rounded mb-6">Previous Year Goals</h2>
        <div className="text-center py-8 text-gray-500">No goals data available</div>
      </div>
    );
  }

  return (
    <div className="w-12/12 p-4 bg-white border shadow-md rounded-md ml-4 mr-8 mt-8">
      <h2 className="text-2xl font-bold text-white bg-blue-500 p-2 rounded mb-6">Previous Year Goals</h2>

      {/* Year Tabs */}
      <div className="flex space-x-2 mb-6">
        {Object.keys(yearlyGoals).map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 
              ${selectedYear === year
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <GoalSection
          title="Manager Assigned Individual Goals"
          icon={Target}
          iconColor="text-blue-500"
          goals={yearlyGoals[selectedYear]?.managerGoals || []}
        />

        <GoalSection
          title="Manager Assigned Team Goals"
          icon={Users}
          iconColor="text-green-500"
          goals={yearlyGoals[selectedYear]?.teamGoals || []}
        />

        <GoalSection
          title="Self-Assigned Goals"
          icon={User}
          iconColor="text-purple-500"
          goals={yearlyGoals[selectedYear]?.employeeGoals || []}
        />
      </div>
    </div>
  );
};

export default PreviousGoalsSection;