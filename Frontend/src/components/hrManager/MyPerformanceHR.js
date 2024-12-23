
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight, Activity, Target, ChevronDown, ChevronUp, BarChart, Award, Users } from "lucide-react";
import axios from 'axios';

const MyPerformanceHR = () => {
  const [date, setDate] = useState(new Date());
  const [appraisals, setAppraisals] = useState(null);
  const [employeeGoals, setEmployeeGoals] = useState([]);
  const [expandedSection, setExpandedSection] = useState('employee');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const employeeName = localStorage.getItem('empName');
  const employeeId = localStorage.getItem('employeeId');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;
  const nextYear2 = currentYear + 2;

  const appraisalStartDate = new Date(`${currentYear}-04-01`).toLocaleDateString('en-CA');
  const appraisalEndDate = new Date(`${currentYear + 1}-03-31`).toLocaleDateString('en-CA');
  const goalSettingStartDate = new Date(`${currentYear}-10-01`).toLocaleDateString('en-CA');
  const goalSettingEndDate = new Date(`${currentYear}-10-07`).toLocaleDateString('en-CA');

  const categoryIcons = {
    'Development': <Target className="w-5 h-5" />,
    'Leadership': <Users className="w-5 h-5" />,
    'Technical': <BarChart className="w-5 h-5" />,
    'Soft Skills': <Award className="w-5 h-5" />,
    "Others": <Target className="w-5 h-5" />,
  };

  useEffect(() => {
    fetchAppraisalDetails();
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchEmployeeGoals = async () => {
      const startDate = `${currentYear+1}-04-01`;
      const endDate = `${parseInt(currentYear)+2}-03-31`;
      try {
        const response = await axios.get(`http://localhost:3003/goals/${employeeId}/${startDate}/${endDate}`);
        setEmployeeGoals(response.data.data[0].goals || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Error fetching employee goals');
        setLoading(false);
      }
    };
    fetchEmployeeGoals();
  }, [currentYear, employeeId]);

  const fetchAppraisalDetails = async () => {
    if (employeeId) {
      try {
        const response = await axios.get(`http://localhost:3003/form/performance/${employeeId}`);
        setAppraisals(response.data);
      } catch (error) {
        console.error('Error fetching appraisals:', error);
      }
    }
  };

  const wishing = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-CA');
    }
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const handleViewClick = (appraisal) => {
    const { employeeId, timePeriod } = appraisal;
    navigate(`/empview/${employeeId}`, { state: { timePeriod } });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const getStatusStyle = (status) => {
    const styles = {
      "Submitted": "bg-blue-100 text-blue-700",
      "Under Review": "bg-purple-100 text-purple-700",
      "Under HR Review": "bg-orange-100 text-orange-700",
      "Completed": "bg-green-100 text-green-700",
      "In Progress": "bg-amber-100 text-amber-700",
      "To Do": "bg-yellow-100 text-yellow-800",
      "Pending HR Review": "bg-indigo-100 text-indigo-700",
      
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-blue-50 mt-10">
      <div className="p-6">
         <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-grow">
            <div className="mb-2">
              <label className="text-4xl font-bold text-yellow-200 block">
                My Performance Insights
              </label>
              <p className="text-white font-medium block mt-2">
                Key metrics and trends to guide your progress.
              </p>
            </div>
          </div>
        
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-600">Goal Setting Period</p>
                <p className="text-sm mt-1 font-semibold text-gray-600">
                  {`${goalSettingStartDate} - ${goalSettingEndDate}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
                </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <Activity className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-blue-900">
                Self Appraisal Overview
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assessment Year</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Initiated On</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Manager name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
         </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appraisals && appraisals.length > 0 ? (
                    appraisals.map((appraisal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700">{employeeName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(appraisal.timePeriod[0])} to {formatDate(appraisal.timePeriod[1])}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(appraisal.timePeriod[0])}</td>
                        <td className="px-6 py-4 text-gray-700">{appraisal.managerName}</td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1  text-sm rounded-md font-medium ${getStatusStyle(appraisal.status)}`}>
                            {appraisal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewClick(appraisal)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            View
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No appraisals found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
             
              <div className="flex flex-col">
  <div className="flex-grow">
  </div>

  <button
    onClick={() => toggleSection('employee')}
    className="w-full justify-between transition-colors duration-200 flex items-center space-x-2 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 "
  >
    <div className="flex items-center space-x-3">
      <Target className="h-6 w-6 text-orange-600" />
      <h3 className="text-xl font-bold text-orange-600">Goals for {nextYear}-{nextYear2}</h3>
    </div>
    {expandedSection === 'employee' ? (
      <ChevronUp className="h-5 w-5 text-gray-500" />
    ) : (
      <ChevronDown className="h-5 w-5 text-gray-500" />
    )}
  </button>
</div>


              {expandedSection === 'employee' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                  {employeeGoals.length > 0 ? employeeGoals.map((goal, index) => (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-green-50" key={index}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            {categoryIcons[goal.category]}
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            {goal.category === 'Others' ? goal.otherText : goal.category}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        {goal.description}
                      </h4>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <BarChart className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-600">
                            Weight: {goal.weightage}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-600">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center text-gray-500 py-4">
                      No goals found for this period.
                    </div>
                  )}
                </div>
              )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPerformanceHR;