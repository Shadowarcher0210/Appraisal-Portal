import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../hrManager/Modal';
import { Calendar, Target } from "lucide-react";

const M_Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [date] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const employeeName = localStorage.getItem('empName');
  const [employees, setEmployees] = useState([]);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const navigate = useNavigate();
  const appraisalStartDate = new Date(`${currentYear}-04-01`).toLocaleDateString('en-CA');
  const appraisalEndDate = new Date(`${currentYear + 1}-04-31`).toLocaleDateString('en-CA');
  const appraisalDueDate = new Date(`${currentYear}-03-15`);
  const appraisalVisibleStart = new Date(`${currentYear}-03-01`);

  const goalSettingStartDate = new Date(`${currentYear}-10-01`).toLocaleDateString('en-CA');
  const goalSettingEndDate = new Date(`${currentYear}-10-07`).toLocaleDateString('en-CA');
  const goalSettingDueDate = new Date(`${currentYear + 1}-03-15`);
  const goalSettingVisibleStart = new Date(`${currentYear + 1}-03-01`);



  const fetchAppraisalDetails = async () => {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      try {
        const response = await axios.get(`http://localhost:3003/form/display/${employeeId}`);

        const currentYear = new Date().getFullYear();
        const sortedData = response.data
          .filter(appraisal => {
            const startYear = parseInt(appraisal.timePeriod[0]);
            return startYear >= currentYear && startYear <= currentYear + 1;
          })
          .sort((a, b) => {
            const startYearA = parseInt(a.timePeriod[0]);
            const startYearB = parseInt(b.timePeriod[0]);
            return startYearA - startYearB;
          });

        setUserData(sortedData);
        console.log("userdata", sortedData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else {
      console.log('User ID not found in local storage.');
    }
  };

  const allEmployees = async () => {
    const managerName = localStorage.getItem('empName')
    if (managerName) {
      try {
        const response = await axios.get(`http://localhost:3003/employees/${managerName}`)
        setEmployees(response.data.data);

        console.log('Employee List :', response.data.data)
      } catch (error) {
        console.error('Error fetching employees in  Dashboard page :', error)
      }
    }
  }

  useEffect(() => {
    fetchAppraisalDetails();
    allEmployees();
  }, []);

  // END POINT for fetching all employees 
  
  const wishing = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleButtonClick = async (appraisal) => {
    const { timePeriod, status } = appraisal;
    const employeeId = localStorage.getItem('employeeId')?.trim();
    const newStatus = status === "Submitted" ? "Submitted" : "In Progress";
    const navigatePath = status === "Submitted" ? `/manager-View?${employeeId}&${timePeriod[0]}&${timePeriod[1]}` : "/manager-Form";

    try {
      const response = await axios.put(`http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        console.log(`Status ${newStatus} Successfully:`, response.data);
        fetchAppraisalDetails();
      } else {
        console.error('Failed to update status:', response.statusText);
      }
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error);
    }

    navigate(navigatePath, { state: { timePeriod } });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const bgColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500'
  ];

  return (
    <div className="flex flex-1 items-start mt-20 ml-6">
      <div className='w-10/12'>

        <div>
          <label className='font-bold text-4xl w-full ml-2 mb-4 text-orange-600'>{wishing()}</label>
          <label className='ml-2 text-3xl font-bold text-cyan-800'>
            {employeeName}
          </label>
          <p className='ml-2 mt-3 text-gray-700'>{formatDate(date)} <span>, </span>{formatTime(date)}</p>
        </div>
        <br />

        <div className="w-12/12 p-3 bg-white border border-gray-300 shadow-lg rounded-lg ml-4 mr-8">
          <h2 className="text-2xl font-bold text-white bg-cyan-900 p-2 rounded mb-4">Appraisal</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Initiated On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData ? (
                userData.map((appraisal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{appraisal.empName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {appraisal.timePeriod[0]} - {appraisal.timePeriod[1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{appraisal.initiatedOn}</td>
                    <td className="px-2 py-2 mt-2 inline-flex whitespace-nowrap text-sm font-medium">
                      <span className={appraisal.status === 'Submitted' ? 'bg-green-100 text-green-700 rounded-lg p-2' : 'text-yellow-800 bg-yellow-100 rounded-lg p-2'}>
                        {appraisal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className='bg-cyan-800 text-white hover:bg-cyan-700 rounded-md px-2 py-2 w-16'
                        onClick={() => handleButtonClick(appraisal)}
                      >
                        {appraisal.status === "Submitted" ? "View" : "Edit"}
                      </button>
                    </td>
                  </tr> 
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No appraisals found for this user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
        {/* Cards Grid with improved spacing */}
        <div className="grid gap-6  lg:grid-cols-4 mb-8 mt-10 ml-4">
          {/* Appraisal Cycle Card */}
          <div className="bg-white rounded-lg border border-gray-200 border-l-8 border-l-orange-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="font-semibold text-gray-800">Appraisal Cycle</h2>
              </div>
              <div className="space-y-3">
                {currentDate >= appraisalVisibleStart && currentDate <= appraisalDueDate ? (
                  <div className="bg-orange-50 rounded-md p-4">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-800">{appraisalDueDate.toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 rounded-md p-4">
                    <p className="text-sm text-gray-600">Cycle Period</p>
                    <p className="font-medium text-gray-800">{appraisalStartDate} to {appraisalEndDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Goal Setting Card */}
          <div className="bg-white rounded-lg border border-gray-200 border-l-8 border-l-green-400 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="font-semibold text-gray-800">Goal Setting</h2>
              </div>
              <div className="space-y-3">
                {currentDate >= goalSettingVisibleStart && currentDate <= goalSettingDueDate ? (
                  <div className="bg-green-50 rounded-md p-4">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-800">{goalSettingDueDate.toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-md p-4">
                    <p className="text-sm text-gray-600">Setting Period</p>
                    <p className="font-medium text-gray-800">{goalSettingStartDate} to {goalSettingEndDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/12 overflow-y-auto max-h-[600px] relative">
        <aside className="bg-white p-6 shadow-lg">
          <div className="sticky top-0 bg-white pb-2 z-10">
            <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
          </div>

          <div className="bg-gray-50 rounded-md p-4 mt-4">
            <div className="space-y-3">
              {employees
              .sort((a, b) => a.empName.localeCompare(b.empName))
              .map((name, index) => (
                <div key={index} className="justify-normal flex">
                  <div className={`w-8 h-8 flex-shrink-0 ${bgColors[index % bgColors.length]} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {getInitials(name.empName)}
                  </div>
                  <div className="ml-3 font-medium self-center">
                    <span>{name.empName}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </aside>
      </div>

    </div>
  )
}

export default M_Dashboard

// import React, { useState, useEffect } from 'react';
// import { ChevronDown, ChevronUp, Target, Plus, Users, Send, Calendar, ArrowRight, Award, BarChart, Edit2 } from 'lucide-react';

// const M_Goals = () => {
//   const [showGoalForm, setShowGoalForm] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [submitting, setSubmitting] = useState({});
//   const [editingGoal, setEditingGoal] = useState(null);
//   const [goalFormData, setGoalFormData] = useState({
//     description: '',
//     category: 'development',
//     weight: '',
//     deadline: ''
//   });

//   const [employees, setEmployees] = useState([
//     { id: 1, name: 'John Doe', role: 'Software Engineer', department: 'Engineering' },
//     { id: 2, name: 'Jane Smith', role: 'Product Manager', department: 'Product' },
//     { id: 3, name: 'Mike Johnson', role: 'UX Designer', department: 'Design' }
//   ]);

//   const [employeeGoals, setEmployeeGoals] = useState(() => {
//     // Load goals from local storage on component mount
//     const storedGoals = localStorage.getItem('employeeGoals');
//     return storedGoals ? JSON.parse(storedGoals) : {};
//   });

//   const [expandedEmployees, setExpandedEmployees] = useState({});

//   const categoryIcons = {
//     development: <div className="w-5 h-5" />,
//     leadership: <div className="w-5 h-5" />,
//     technical: <div className="w-5 h-5" />,
//     'soft-skills': <div className="w-5 h-5" />
//   };

//   const toggleEmployee = (employeeId) => {
//     setExpandedEmployees(prev => ({
//       ...prev,
//       [employeeId]: !prev[employeeId]
//     }));
//   };

//   const handleAddGoal = () => {
//     if (!selectedEmployee || !goalFormData.description || !goalFormData.weight) return;

//     if (editingGoal) {
//       setEmployeeGoals(prev => ({
//         ...prev,
//         [selectedEmployee]: prev[selectedEmployee].map(goal => 
//           goal.id === editingGoal.id ? { ...goal, ...goalFormData } : goal
//         )
//       }));
//       setEditingGoal(null);
//     } else {
//       setEmployeeGoals(prev => ({
//         ...prev,
//         [selectedEmployee]: [
//           ...(prev[selectedEmployee] || []),
//           {
//             id: Date.now(),
//             ...goalFormData,
//             status: 'Not Started',
//             progress: 0,
//             created_at: new Date().toISOString()
//           }
//         ]
//       }));
//     }

//     setGoalFormData({
//       description: '',
//       category: 'development',
//       weight: '',
//       deadline: ''
//     });
//     setShowGoalForm(false);

//     // Save the updated goals to local storage
//     localStorage.setItem('employeeGoals', JSON.stringify(employeeGoals));
//   };

//   const handleEditGoal = (employeeId, goal) => {
//     setSelectedEmployee(employeeId);
//     setEditingGoal(goal);
//     setGoalFormData({
//       description: goal.description,
//       category: goal.category,
//       weight: goal.weight,
//       deadline: goal.deadline
//     });
//     setShowGoalForm(true);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'Not Started': 'bg-gray-100 text-gray-800 border-gray-200',
//       'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
//       'Completed': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || colors['Not Started'];
//   };

//   const handleSubmitGoals = async (employeeId) => {
//     setSubmitting(prev => ({ ...prev, [employeeId]: true }));
    
//     try {
//       // Save the updated goals to local storage
//       localStorage.setItem('employeeGoals', JSON.stringify(employeeGoals));

//       // Show success message
//       // showSuccessMessage('Goals submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting goals:', error);
//       // showErrorMessage('Failed to submit goals. Please try again.');
//     } finally {
//       setSubmitting(prev => ({ ...prev, [employeeId]: false }));
//     }
//   };


//   useEffect(() => {
//     // Load goals from local storage on component mount
//     const storedGoals = localStorage.getItem('employeeGoals');
//     if (storedGoals) {
//       setEmployeeGoals(JSON.parse(storedGoals));
//     }
//   }, []);

//   return (
//     <div className="justify-center items-start mt-20 ml-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-orange-600">Team Performance Management</h1>
//         <p className="text-gray-600 mt-2">Set and track meaningful goals for your team members</p>
//       </div>

//       <div className="space-y-6">
//         {employees.map(employee => (
//           <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div 
//               className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//               onClick={() => toggleEmployee(employee.id)}
//             >
//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-cyan-800 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-inner">
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-gray-800">{employee.name}</h3>
//                   <div className="flex items-center text-sm text-gray-500 mt-1">
//                     <Award className="w-4 h-4 mr-1" />
//                     <span>{employee.role}</span>
//                     <span className="mx-2">•</span>
//                     <span>{employee.department}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedEmployee(employee.id);
//                     setEditingGoal(null);
//                     setShowGoalForm(true);
//                   }}
//                   className="flex items-center px-4 py-2 text-sm font-medium bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-sm"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Goal
//                 </button>
//                 {employeeGoals[employee.id]?.length > 0 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSubmitGoals(employee.id);
//                     }}
//                     disabled={submitting[employee.id]}
//                     className="flex items-center px-4 py-2 text-sm bg-white border border-cyan-800 text-cyan-800 font-medium rounded-lg hover:bg-cyan-700 hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50"
//                   >
//                     <Send className="w-4 h-4 mr-2" />
//                     {submitting[employee.id] ? 'Submitting...' : 'Submit Goals'}
//                   </button>
//                 )}
//                 {expandedEmployees[employee.id] ? 
//                   <ChevronUp className="w-5 h-5 text-gray-400" /> : 
//                   <ChevronDown className="w-5 h-5 text-gray-400" />
//                 }
//               </div>
//             </div>

//             {expandedEmployees[employee.id] && (
//               <div className="p-6 border-t border-gray-100 bg-gray-50">
//                 {employeeGoals[employee.id]?.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {employeeGoals[employee.id].map(goal => (
//                       <div 
//                         key={goal.id} 
//                         className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
//                       >
//                         <div className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center space-x-2">
//                               <div className="p-2 bg-blue-50 rounded-lg">
//                                 {categoryIcons[goal.category]}
//                               </div>
//                               <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
//                                 {goal.category}
//                               </span>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleEditGoal(employee.id, goal);
//                               }}
//                               className="p-2 text-gray-400 hover:text-cyan-900 transition-colors duration-200"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                           </div>
                          
//                           <h4 className="text-lg font-medium text-gray-900 mb-3 ">
//                             {goal.description}
//                           </h4>

//                           <div className="flex flex-wrap gap-4 mt-4">
//                             <div className="flex items-center">
//                               <BarChart className="w-4 h-4 text-gray-400 mr-2" />
//                               <span className="text-sm font-medium text-gray-900">
//                                 Weight: {goal.weight}%
//                               </span>
//                             </div>
                            
//                             <div className="flex items-center">
//                               <Calendar className="w-4 h-4 text-gray-400 mr-2" />
//                               <span className="text-sm text-gray-600">
//                                 Due: {new Date(goal.deadline).toLocaleDateString()}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between mt-6">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)} border`}>
//                               {goal.status}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               Created {new Date(goal.created_at).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                       <Target className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <p className="text-gray-500">No goals set for this employee yet</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Goal Form Modal */}
//       {showGoalForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-6">
//                 {editingGoal ? 'Edit Goal' : 'Set New Goal'} for {employees.find(e => e.id === selectedEmployee)?.name}
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <select 
//                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
//                     className="w-full p-3 border rounded-lg resize-none"
//                     value={goalFormData.description}
//                     onChange={e => setGoalFormData({...goalFormData, description: e.target.value})}
//                     rows="3"
//                     placeholder="Enter goal description..."
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Weight (%)
//                     </label>
//                     <input 
//                       type="number"
//                       className="w-full p-2 border rounded-lg "
//                       value={goalFormData.weight}
//                       onChange={e => setGoalFormData({...goalFormData, weight: e.target.value})}
//                       min="0"
//                       max="100"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Deadline
//                     </label>
//                     <input 
//                       type="date"
//                       className="w-full p-2 border rounded-lg"
//                       value={goalFormData.deadline}
//                       onChange={e => setGoalFormData({...goalFormData, deadline: e.target.value})}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button 
//                   onClick={() => {
//                     setShowGoalForm(false);
//                     setEditingGoal(null);
//                   }}
//                   className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={handleAddGoal}
//                   className="px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 flex items-center"
//                 >
//                     {editingGoal ? 'Save Changes' : 'Add Goal'}
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </button>
//                 </div>
//             </div>
//          </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default M_Goals;