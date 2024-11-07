import axios from 'axios';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const M_Performance = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);
   const [filteredApps, setFilteredApps] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [appraisals, setAppraisals] = useState(null);
    const [expandedSection, setExpandedSection] = useState('manager');
    const employeeName = localStorage.getItem('empName');
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const [userData,setUserData]=useState(null);
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const getAcademicYearRange = (year) => {
        const start = new Date(year, 3, 1);
        const end = new Date(year + 1, 2, 31, 23, 59, 59, 999);
        return { start, end };
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
    

    const fetchAppraisalYear = async (selectedYear) => {
        console.log("Fetching data for year:", selectedYear);
        const userId = localStorage.getItem('userId');
        if (userId) {
          const startYear = parseInt(selectedYear.split('-')[0], 10);
          const endYear = startYear + 1;
    
          const startDate = new Date(`${startYear}-03-01`).toISOString().split('T')[0];
          const endDate = new Date(`${endYear}-04-30`).toISOString().split('T')[0];
    
    
          try {
            const response = await axios.get(`http://localhost:3003/time/getTime/${startDate}/${endDate}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const formattedUserData = response.data.map(item => ({
              ...item,
              timePeriod: item.timePeriod.map(date => date.split('T')[0]),
            }));
    
            setUserData(formattedUserData);
    
            console.log("userdata", formattedUserData);
            console.log("userdata", userData);
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        } else {
          console.log('User ID not found in local storage.');
        }
      };
      useEffect(() => {
        if (selectedYear) {
          fetchAppraisalDetails(selectedYear);
        }
      }, [selectedYear]);


    const handleViewClick = (appraisal) => {
        console.log("Navigating to view");
        const { employeeId, timePeriod } = appraisal;
        navigate(`/empview?${employeeId}&${timePeriod[0]}&${timePeriod[1]}`, { state: { timePeriod } });
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

    return (
        <div className="justify-center items-start mt-20 ml-6">
            <div>
                <label className='font-bold text-4xl w-full ml-2 mb-4'></label>
                <label className='ml-2 text-3xl font-bold text-orange-600'>
                    Performance Insights
                </label>
                <p className='ml-4 mt-3 text-gray-800 font-medium'>Key metrics and trends to guide your Team progress.</p>
            </div>

            <div className='mt-2 ml-2'>
            <label className='border-black border-1 rounded-full py-1 px-9 bg-slate-100'>
            <label htmlFor="time-period" className=''>Time Period : </label>
            <select
              id="time-period"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>


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

                    {/* <div className="flex justify-between mt-5 ml-2 mr-8">
                        {/* Previous Year Goals Section */}
                        {/* <div className="w-full p-3 bg-white border shadow-md rounded-md">
                            <h2 className="text-2xl font-bold text-white bg-blue-600 p-2 rounded mb-6"> Goals for {previousYear}-{currentYear} </h2> */}


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
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        {[1, 2].map((goal) => (
                                            <div key={goal} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <h4 className="font-semibold text-gray-800 mb-2">Goal {goal}</h4>
                                                <p className="text-gray-600 text-sm">Description of manager-assigned individual goal {goal}.</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm text-blue-500 font-medium">Status: Completed</span>
                                                    <span className="text-sm text-gray-500">Weight: 30%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div> */}

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

                    {/* </div> */} 



                </div>

            </div>
        </div>
    )
};

export default M_Performance;

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Target, Plus, Users } from 'lucide-react';

// const M_Performance = () => {
//   const [showGoalForm, setShowGoalForm] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [goalFormData, setGoalFormData] = useState({
//     description: '',
//     category: 'development',
//     weight: '',
//     deadline: ''
//   });

//   // Sample employees data - replace with your actual data
//   const [employees] = useState([
//     { id: 1, name: 'John Doe', role: 'Software Engineer' },
//     { id: 2, name: 'Jane Smith', role: 'Product Manager' },
//     { id: 3, name: 'Mike Johnson', role: 'UX Designer' }
//   ]);

//   // Goals state for each employee
//   const [employeeGoals, setEmployeeGoals] = useState({});
  
//   // State to track expanded employee sections
//   const [expandedEmployees, setExpandedEmployees] = useState({});

//   const toggleEmployee = (employeeId) => {
//     setExpandedEmployees(prev => ({
//       ...prev,
//       [employeeId]: !prev[employeeId]
//     }));
//   };

//   const handleAddGoal = () => {
//     if (!selectedEmployee || !goalFormData.description || !goalFormData.weight) return;

//     setEmployeeGoals(prev => ({
//       ...prev,
//       [selectedEmployee]: [
//         ...(prev[selectedEmployee] || []),
//         {
//           id: Date.now(),
//           ...goalFormData,
//           status: 'Not Started',
//           progress: 0
//         }
//       ]
//     }));

//     setGoalFormData({
//       description: '',
//       category: 'development',
//       weight: '',
//       deadline: ''
//     });
//     setShowGoalForm(false);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'Not Started': 'bg-gray-100 text-gray-800',
//       'In Progress': 'bg-blue-100 text-blue-800',
//       'Completed': 'bg-green-100 text-green-800'
//     };
//     return colors[status] || colors['Not Started'];
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-orange-600">Team Performance Management</h1>
//         <p className="text-gray-600 mt-2">Manage and track goals for your team members</p>
//       </div>

//       {/* Employee List */}
//       <div className="space-y-4">
//         {employees.map(employee => (
//           <div key={employee.id} className="bg-white rounded-lg shadow-sm">
//             <div 
//               className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
//               onClick={() => toggleEmployee(employee.id)}
//             >
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Users className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-gray-800">{employee.name}</h3>
//                   <p className="text-sm text-gray-500">{employee.role}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedEmployee(employee.id);
//                     setShowGoalForm(true);
//                   }}
//                   className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4 mr-1" />
//                   Add Goal
//                 </button>
//                 {expandedEmployees[employee.id] ? 
//                   <ChevronUp className="w-5 h-5 text-gray-400" /> : 
//                   <ChevronDown className="w-5 h-5 text-gray-400" />
//                 }
//               </div>
//             </div>

//             {/* Employee Goals */}
//             {expandedEmployees[employee.id] && (
//               <div className="p-4 border-t border-gray-100">
//                 {employeeGoals[employee.id]?.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {employeeGoals[employee.id].map(goal => (
//                       <div 
//                         key={goal.id} 
//                         className="p-4 rounded-lg border-l-4 border-blue-500 bg-white shadow-sm"
//                       >
//                         <div className="flex items-center space-x-2 mb-2">
//                           <Target className="w-4 h-4 text-blue-500" />
//                           <span className="text-sm font-medium text-blue-600 uppercase">
//                             {goal.category}
//                           </span>
//                         </div>
//                         <p className="text-gray-800 font-medium mb-2">{goal.description}</p>
//                         <div className="flex items-center justify-between mt-4">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
//                             {goal.status}
//                           </span>
//                           <span className="text-sm text-gray-500">Weight: {goal.weight}%</span>
//                         </div>
//                         {goal.deadline && (
//                           <p className="text-sm text-gray-500 mt-2">
//                             Due: {new Date(goal.deadline).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No goals set for this employee yet</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Add Goal Modal */}
//       {showGoalForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Add New Goal for {employees.find(e => e.id === selectedEmployee)?.name}
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <select 
//                     className="w-full p-2 border rounded-md"
//                     value={goalFormData.category}
//                     onChange={e => setGoalFormData({...goalFormData, category: e.target.value})}
//                   >
//                     <option value="development">Development</option>
//                     <option value="leadership">Leadership</option>
//                     <option value="technical">Technical</option>
//                     <option value="soft-skills">Soft Skills</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea 
//                     className="w-full p-2 border rounded-md"
//                     value={goalFormData.description}
//                     onChange={e => setGoalFormData({...goalFormData, description: e.target.value})}
//                     rows="3"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Weight (%)
//                   </label>
//                   <input 
//                     type="number"
//                     className="w-full p-2 border rounded-md"
//                     value={goalFormData.weight}
//                     onChange={e => setGoalFormData({...goalFormData, weight: e.target.value})}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Deadline
//                   </label>
//                   <input 
//                     type="date"
//                     className="w-full p-2 border rounded-md"
//                     value={goalFormData.deadline}
//                     onChange={e => setGoalFormData({...goalFormData, deadline: e.target.value})}
//                   />
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button 
//                   onClick={() => setShowGoalForm(false)}
//                   className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={handleAddGoal}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Add Goal
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default M_Performance;
