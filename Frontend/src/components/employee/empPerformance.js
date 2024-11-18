import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Target, TrendingUp, Briefcase, Plus, Users, Send, Calendar, ArrowRight, Award, BarChart, Edit2 } from 'lucide-react';

const E_PerformancePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [appraisals, setAppraisals] = useState(null);
  const [expandedSection, setExpandedSection] = useState('manager');
  const [employeeGoals, setEmployeeGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const employeeId = localStorage.getItem('employeeId');
  const categoryIcons = {
    development: <Target className="w-5 h-5" />,
    leadership: <Users className="w-5 h-5" />,
    technical: <BarChart className="w-5 h-5" />,
    'soft-skills': <Award className="w-5 h-5" />
  };
  const employeeName = localStorage.getItem('empName');
  const navigate = useNavigate();
  const menuRef = useRef();


  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;


  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const years = [];

    for (let i = startYear; i <= currentYear; i++) {
      years.push(`${i}-${i + 1}`);
    }
    setAcademicYears(years);
    const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
    setSelectedYear(`${defaultYear}-${defaultYear + 1}`);
  }, []);




  useEffect(() => {
    if (selectedYear) {
      fetchAppraisalDetails(selectedYear);
    }
  }, [selectedYear]);

  const handleMenuClick = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleCloseMenu = () => {
    setOpenMenuIndex(null);
  };


  const fetchAppraisalDetails = async () => {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      try {
        const response = await axios.get(`http://localhost:3003/form/performance/${employeeId}`)
        setAppraisals(response.data);
        console.log('Fetched Appraisals in Performance Page :', response.data);
      } catch (error) {
        console.error('Error fetching appraisals in Performance page :', error)
      }
    }

  }


  const handleViewClick = (appraisal) => {
    console.log("Navigating to view");
    const { employeeId, timePeriod } = appraisal;
    navigate(`/empview/${employeeId}`, { state: { timePeriod } });
    handleCloseMenu();
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  const recentActivities = [
    { action: "Goals approved by manager", type: "success" },
    { action: "Self-assessment submitted", type: "info" },
    { action: "Review meeting scheduled", type: "warning" },
  ];

  useEffect(() => {
    const fetchEmployeeGoals = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/goals/${employeeId}`);
        setEmployeeGoals(response.data.data || []);
        console.log("goals", response.data)

        setLoading(false);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Error fetching employee goals');
        setLoading(false);
      }
    };

    fetchEmployeeGoals();
  }, []);



  return (
    <div className="  ml-4 mt-20 ">
      <div>
        <label className='font-bold text-4xl w-full ml-2 mb-4'></label>
        <label className='ml-2 text-3xl font-bold text-orange-600'>
          Performance Insights
        </label>
        <p className='ml-4 mt-3 text-gray-800 font-medium'>Key metrics and trends to guide your progress.</p>
      </div>

      <div className="flex-1 flex ">


        <div className="flex-1 p-2 mt-5 overflow-hidden max-h-full">

          <div className="w-12/12 p-3 bg-white border shadow-md rounded-md ml-2 mr-8">
            <h2 className="text-2xl font-bold text-white bg-blue-600 p-2 rounded mb-4">Preceding Appraisals</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-00 uppercase tracking-wider">Employee name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Initiated On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Manager name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appraisals && appraisals.length > 0 ? (
                  appraisals.map((appraisal, index) => (
                    <tr key={appraisal.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-gray-500">
                        {employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {formatDate(appraisal.timePeriod[0])} to {formatDate(appraisal.timePeriod[1])}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{formatDate(appraisal.timePeriod[0])}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium  text-gray-500">
                        {appraisal.managerName}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-gray-500"> */}
                      <td className="px-6 py-2 mt-4 inline-flex text-sm font-semibold rounded-lg bg-green-100 text-green-700">

                        {appraisal.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-blue-900 hover:text-blue-700 cursor-pointer">
                        <button className='bg-blue-600 text-white hover:bg-blue-600 rounded-md px-2 py-2 w-16' onClick={() => handleViewClick(appraisal)}>View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-900">
                      No appraisals found for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-5 ml-2 mr-8">
            {/* Previous Year Goals Section */}
            <div className="w-full p-3 bg-white border shadow-md rounded-md">
              <h2 className="text-2xl font-bold text-white bg-blue-600 p-2 rounded mb-6">Goals for {previousYear}-{currentYear} </h2>


              {/* Manager Goals */}
              {/* <div className="mb-2">
                <button
                  onClick={() => toggleSection('manager')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-700"> View Goals</h3>
                  </div>
                  {expandedSection === 'manager' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === 'manager' && (
                  employeeGoals.map((goal, index) => (
                    <div className="p-6" key={goal._id}> 
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    {categoryIcons[goal.category]}
                                </div>
                                <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                                    {goal.category}
                                </span>
                            </div>
                        </div>
                
                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                            {goal.description}
                        </h4>
                
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center">
                                <BarChart className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    Weight: {goal.weightage}%
                                </span>
                            </div>
                
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                    Due: {new Date(goal.deadline).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
                
                )}
              </div> */}
              <div className="mb-2">
                <button
                  onClick={() => toggleSection('manager')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-700"> View Goals</h3>
                  </div>
                  {expandedSection === 'manager' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === 'manager' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {employeeGoals.map((goal, index) => (
                      <div className="bg-white p-6 rounded-lg shadow-md" key={goal._id}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              {categoryIcons[goal.category]}
                            </div>
                            <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                              {goal.category}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                          {goal.description}
                        </h4>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <BarChart className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              Weight: {goal.weightage}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>



            </div>

            {/* Recent Activities Section */}
            {/* <div className="w-1/4 ml-4 max-h-96 bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 ">Recent Activities</h2>
              <div className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className={`w-3 h-3 rounded-full mt-1 ${activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                    </div>
                  </div>
                ))}
                <br />

              </div>
            </div> */}

          </div>

        </div>

      </div>
    </div>
  );
};

export default E_PerformancePage;