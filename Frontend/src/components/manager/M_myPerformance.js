import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Target, TrendingUp, Briefcase, Plus, Users, Send, Calendar, ArrowRight, Award, BarChart, Edit2 } from 'lucide-react';



const M_myPerformance = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [, setAcademicYears] = useState([]);
    const [, setOpenMenuIndex] = useState(null);
    const [appraisals, setAppraisals] = useState(null);
    const employeeName = localStorage.getItem('empName');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeGoals, setEmployeeGoals] = useState([]);
    const [expandedSection, setExpandedSection] = useState('employee');


    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const nextYear2 = currentYear + 2;
  
    const employeeId = localStorage.getItem('employeeId');
    const categoryIcons = {
        'Development': <Target className="w-5 h-5" />,
        'Leadership': <Users className="w-5 h-5" />,
        'Technical': <BarChart className="w-5 h-5" />,
        'Soft Skills': <Award className="w-5 h-5" />,
        "Others": <Target className="w-5 h-5" />,  
    
      };

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
    

    useEffect(() => {
        const fetchEmployeeGoals = async () => {
          
            const startDate = `${currentYear+1}-04-01`;
            const endDate = `${parseInt(currentYear) + 2}-03-31`;
          try {
            const response = await axios.get(`http://localhost:3003/goals/${employeeId}/${startDate}/${endDate}`);
            setEmployeeGoals(response.data.data[0].goals || []);
            console.log("goals", response.data.data[0].goals)
    
            setLoading(false);
          } catch (err) {
            console.error('Error fetching goals:', err);
            setError('Error fetching employee goals');
            setLoading(false);
          }
        };
    
        fetchEmployeeGoals();
      }, []);
    

    const handleViewClick = (appraisal) => {
        console.log("Navigating to view");
        const { employeeId, timePeriod } = appraisal;
        navigate(`/manager-View?${employeeId}&${timePeriod[0]}&${timePeriod[1]}`, { state: { timePeriod } });
        handleCloseMenu();
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toISOString().split('T')[0];
    };

  

    return (
        <div className="justify-center items-start mt-20 ml-6">
            <div>
                <label className='ml-2 text-3xl font-bold text-orange-600'>
                    My Performance Insights
                </label>
                <p className='ml-2 mt-3 text-gray-500 font-medium'>Key metrics and trends to guide your progress.</p>
            </div>

            <div className="flex-1 flex ">


                <div className="flex-1 p-2 mt-5 overflow-hidden max-h-full">

                    <div className="w-12/12 p-3 bg-white border shadow-md rounded-md ml-2 mr-8">
                        <h2 className="text-2xl font-bold text-white bg-cyan-800 p-2 rounded mb-4">Preceding Appraisals</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Initiated On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reporting Manager</th>
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
                                            <button 
 className={`bg-blue-500 text-white rounded-md px-4 py-2 text-sm transition-colors 
  ${["Under Review", "Under HR Review"].includes(appraisal.status) 
      ? "opacity-50 cursor-not-allowed bg-blue-300" 
      : "hover:bg-blue-600" 
  }`}   
   onClick={() => handleViewClick(appraisal)}
    disabled={["Under Review", "Under HR Review"].includes(appraisal.status)}
  >
    {["Submitted", "Under Review","Pending HR Review", "Under HR Review","Completed"].includes(appraisal.status) ? "View" : "Edit"}
  </button>                                            </td>
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
              <h2 className="text-2xl font-bold text-white bg-cyan-800 p-2 rounded mb-6">Goals for {nextYear}-{nextYear2} </h2>

              <div className="mb-2">
                <button
                  onClick={() => toggleSection('employee')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-700"> View Goals</h3>
                  </div>
                  {expandedSection === 'employee' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSection === 'employee' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {employeeGoals.length>0 && employeeGoals.map((goal, index) => (
                      <div className="bg-white p-6 rounded-lg shadow-md" key={index}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              {categoryIcons[goal.category]}
                            </div>
                            <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                                   {goal.category === 'Others' ? goal.otherText : goal.category}
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

                    {/* </div>  */}


                </div>

            </div>
        </div>
    )
}

export default M_myPerformance