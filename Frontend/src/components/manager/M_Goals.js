// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { ChevronDown, ChevronUp, Target, Plus, Users, Send, Calendar, Award, BarChart, Edit2 } from 'lucide-react';
// import { useLocation } from "react-router-dom";

// const M_Goals = () => {
//   const [showGoalForm, setShowGoalForm] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [submitting, setSubmitting] = useState({});
//   const[goals,setGoals]=useState([]);

//   const [editingGoal, setEditingGoal] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [employeeToSubmit, setEmployeeToSubmit] = useState(null);
//   const [submittedEmployees, setSubmittedEmployees] = useState(() => {
//     const submitted = localStorage.getItem('submittedEmployees');
//     return submitted ? JSON.parse(submitted) : [];
//   });

//   const [goalFormData, setGoalFormData] = useState({
//     employeeId: '',
//     empName: '',
//     category: 'development',
//     description: '',
//     weightage: '',
//     deadline: ''
//   });

//   const location = useLocation();
//   const { timePeriod } = location.state || {};
//   const [employees, setEmployees] = useState([]);

//   const [employeeGoals, setEmployeeGoals] = useState(() => {
//     const storedGoals = localStorage.getItem('employeeGoals');
//     return storedGoals ? JSON.parse(storedGoals) : {};
//   });

//   const [expandedEmployees, setExpandedEmployees] = useState({});

//   const categoryIcons = {
//     development: <Target className="w-5 h-5" />,
//     leadership: <Users className="w-5 h-5" />,
//     technical: <BarChart className="w-5 h-5" />,
//     'soft-skills': <Award className="w-5 h-5" />
//   };

//   const toggleEmployee = (employeeId) => {
//     setExpandedEmployees(prev => ({
//       ...prev,
//       [employeeId]: !prev[employeeId]
//     }));
//   };

//   const handleAddGoal = () => {
//     if (!selectedEmployee || !goalFormData.description || !goalFormData.weightage) return;
//     const employeeName = employees.find(e => e.employeeId === selectedEmployee)?.empName;

//     if (editingGoal) {
//       setEmployeeGoals(prev => ({
//         ...prev,
//         [selectedEmployee]: prev[selectedEmployee].map(goal =>
//           goal.id === editingGoal.id ? { ...goal, ...goalFormData } : goal
//         )
//       }));
//       setEditingGoal(null);
//     } else {
//       setEmployeeGoals(prev => {
//         const newGoal = {
//           ...goalFormData,
//           id: Date.now(),
//           employeeName,
//           employeeId: selectedEmployee
//         };
//         const updatedGoals = {
//           ...prev,
//           [selectedEmployee]: [...(prev[selectedEmployee] || []), newGoal]
//         };
//         localStorage.setItem('employeeGoals', JSON.stringify(updatedGoals));
//         return updatedGoals;
//       });
//     }

//     setGoalFormData({
//       employeeId: '',
//       empName: '',
//       description: '',
//       category: 'development',
//       weightage: '',
//       deadline: ''
//     });
//     setShowGoalForm(false);
//   };

//   useEffect(() => {
//     const allEmployees = async () => {
//       const managerName = localStorage.getItem('empName');
//       if (managerName) {
//         try {
//           const response = await axios.get(`http://localhost:3003/employees/${managerName}`);
//           response.data.data.forEach(employee => fetchGoals(employee.employeeId));
//           setEmployees(response.data.data);
//         } catch (error) {
//           console.error('Error fetching employees:', error);
//         }
//       }
//     };
//     allEmployees();
//   }, []);

//   const handleEditGoal = (employeeId, goal) => {
//     setSelectedEmployee(employeeId);
//     setEditingGoal(goal);
//     setGoalFormData({
//       employeeId,
//       empName: goal.empName,
//       description: goal.description,
//       category: goal.category,
//       weightage: goal.weightage,
//       deadline: goal.deadline
//     });
//     setShowGoalForm(true);
//   };

//   const fetchGoals = async (employeeId) => {
//     if (employeeId) {
//       try {
//         const response = await axios.get(`http://localhost:3003/goals/${employeeId}`);
//         setGoals(prevGoals => ({
//           ...prevGoals,
//           [employeeId]: response.data.data
//         }));
//         console.log("Goals getting:", response.data);
//       } catch (error) {
//         console.error("Error fetching goals details:", error);
//       }
//     }
//   };

//   const handleSubmitConfirm = (employeeId) => {
//     setEmployeeToSubmit(employeeId);
//     setShowConfirmDialog(true);
//   };

//   const handleSubmitGoals = async () => {
//     if (!employeeToSubmit) return;

//     setSubmitting(prev => ({ ...prev, [employeeToSubmit]: true }));
//     try {
//       const goals = employeeGoals[employeeToSubmit] || [];
//       const response = await axios.post(`http://localhost:3003/goals/${employeeToSubmit}`, { goals });

//       setSubmittedEmployees(prev => {
//         const newSubmitted = [...prev, employeeToSubmit];
//         localStorage.setItem('submittedEmployees', JSON.stringify(newSubmitted));
//         return newSubmitted;
//       });

//       // Clear goals for this employee after successful submission
//       setEmployeeGoals(prev => {
//         const newGoals = { ...prev };
//         delete newGoals[employeeToSubmit];
//         localStorage.setItem('employeeGoals', JSON.stringify(newGoals));
//         return newGoals;
//       });
//     } catch (error) {
//       console.error('Error submitting goals:', error);
//     } finally {
//       setSubmitting({});
//       setShowConfirmDialog(false);
//       setEmployeeToSubmit(null);
//     }
//   };

//   return (
//     <div className="justify-center items-start mt-20 ml-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-orange-600">Team Performance Management</h1>
//         <p className="text-gray-600 mt-2">Set and track meaningful goals for your team members</p>
//       </div>

//       <div className="space-y-6">
//       <div className="space-y-6">
//   {employees.map((employee) => (
//     <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden">
//       <div
//         className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
//         onClick={() => toggleEmployee(employee.employeeId)}
//       >
//         <div className="flex items-center space-x-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-cyan-800 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-inner">
//             <Users className="w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-lg text-gray-800">{employee.empName}</h3>
//             <div className="flex items-center text-sm text-gray-500 mt-1">
//               <Award className="w-4 h-4 mr-1" />
//               <span>{employee.designation}</span>
//               <span className="mx-2">•</span>
//               <span>{employee.department}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           {(!submittedEmployees.includes(employee.employeeId) && goals[employee.employeeId]?.length > 0) && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedEmployee(employee.employeeId);
//                   setEditingGoal(null);
//                   setShowGoalForm(true);
//                 }}
//                 className="flex items-center px-4 py-2 text-sm font-medium bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-sm"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Goal
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleSubmitConfirm(employee.employeeId);
//                 }}
//                 disabled={submitting[employee.employeeId]}
//                 className="flex items-center px-4 py-2 text-sm bg-white border border-cyan-800 text-cyan-800 font-medium rounded-lg hover:bg-cyan-700 hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50"
//               >
//                 <Send className="w-4 h-4 mr-2" />
//                 Submit Goals
//               </button>
//             </>
//           )}
//           {goals[employee.employeeId]?.length > 0 && submittedEmployees.includes(employee.employeeId) ? (
//             <span className="text-green-600 font-medium flex items-center">
//               <Award className="w-4 h-4 mr-2" />
//               Goals Submitted
//             </span>
//           ) : null}
//           {expandedEmployees[employee.employeeId] ?
//             <ChevronUp className="w-5 h-5 text-gray-400" /> :
//             <ChevronDown className="w-5 h-5 text-gray-400" />
//           }
//         </div>
//       </div>

//           {expandedEmployees[employee.employeeId] && (
//             <div className="p-6 border-t border-gray-100 bg-gray-50">
//               {(goals[employee.employeeId]?.length > 0 || submittedEmployees.includes(employee.employeeId)) ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {goals[employee.employeeId]?.map(goal => (
//                     <div
//                       key={goal.id}
//                       className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
//                     >
//                       <div className="p-6">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center space-x-2">
//                             <div className="p-2 bg-blue-50 rounded-lg">
//                               {categoryIcons[goal.category]}
//                             </div>
//                             <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
//                               {goal.category}
//                             </span>
//                           </div>
//                           {!submittedEmployees.includes(employee.employeeId) && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleEditGoal(employee.employeeId, goal);
//                               }}
//                               className="p-2 text-gray-400 hover:text-cyan-900 transition-colors duration-200"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <h4 className="text-lg font-medium text-gray-900 mb-3">
//                           {goal.description}
//                         </h4>

//                         <div className="flex flex-wrap gap-4 mt-4">
//                           <div className="flex items-center">
//                             <BarChart className="w-4 h-4 text-gray-400 mr-2" />
//                             <span className="text-sm font-medium text-gray-900">
//                               Weight: {goal.weightage}%
//                             </span>
//                           </div>

//                           <div className="flex items-center">
//                             <Calendar className="w-4 h-4 text-gray-400 mr-2" />
//                             <span className="text-sm text-gray-600">
//                               Due: {new Date(goal.deadline).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                     <Target className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-500">No goals set for this employee yet</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>

//       </div>

//       {/* Goal Form Modal */}
//       {showGoalForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-6">
//                 {editingGoal ? 'Edit Goal' : 'Set New Goal'} for {employees.find(e => e.employeeId === selectedEmployee)?.empName}
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
//                       className="w-full p-2 border rounded-lg"
//                       value={goalFormData.weightage}
//                       onChange={e => setGoalFormData({...goalFormData, weightage: e.target.value})}
//                      min="0"
//                      max="100"
//                      placeholder="Enter weightage..."
//                    />
//                  </div>
//                  <div>
//                    <label className="block text-sm font-medium text-gray-700 mb-1">
//                      Deadline
//                    </label>
//                    <input
//                      type="date"
//                      className="w-full p-2 border rounded-lg"
//                      value={goalFormData.deadline}
//                      onChange={e => setGoalFormData({...goalFormData, deadline: e.target.value})}
//                    />
//                  </div>
//                </div>
//              </div>
//              <div className="mt-6 flex justify-end space-x-3">
//                <button
//                  onClick={() => {
//                    setShowGoalForm(false);
//                    setEditingGoal(null);
//                  }}
//                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                >
//                  Cancel
//                </button>
//                <button
//                  onClick={handleAddGoal}
//                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-800 rounded-lg hover:bg-cyan-700"
//                >
//                  {editingGoal ? 'Update Goal' : 'Add Goal'}
//                </button>
//              </div>
//            </div>
//          </div>
//        </div>
//      )}

//      {/* Custom Confirmation Dialog */}
//      {showConfirmDialog && (
//        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
//            <div className="mb-6">
//              <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                Submit Goals
//              </h3>
//              <p className="text-gray-600">
//                Are you sure you want to submit these goals? This action cannot be undone.
//              </p>
//            </div>

//            <div className="flex justify-end space-x-3">
//              <button
//                onClick={() => setShowConfirmDialog(false)}
//                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//              >
//                Cancel
//              </button>
//              <button
//                onClick={handleSubmitGoals}
//                className="px-4 py-2 text-sm font-medium text-white bg-cyan-800 rounded-lg hover:bg-cyan-700 flex items-center"
//                disabled={submitting[employeeToSubmit]}
//              >
//                {submitting[employeeToSubmit] ? (
//                  <>
//                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                    </svg>
//                    Submitting...
//                  </>
//                ) : (
//                  'Confirm Submit'
//                )}
//              </button>
//            </div>
//          </div>
//        </div>
//      )}
//    </div>
//  );
// };

// export default M_Goals;
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Target,
  Plus,
  Users,
  Send,
  Calendar,
  Award,
  BarChart,
  Edit2,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const M_Goals = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToSubmit, setEmployeeToSubmit] = useState(null);
  const [submittedEmployees, setSubmittedEmployees] = useState(() => {
    const submitted = localStorage.getItem("submittedEmployees");
    return submitted ? JSON.parse(submitted) : [];
  });
  const [goals, setGoals] = useState([]);

  const [goalFormData, setGoalFormData] = useState({
    employeeId: "",
    empName: "",
    category: "development",
    description: "",
    weightage: "",
    deadline: "",
  });

  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [employees, setEmployees] = useState([]);

  const [employeeGoals, setEmployeeGoals] = useState(() => {
    const storedGoals = localStorage.getItem("employeeGoals");
    return storedGoals ? JSON.parse(storedGoals) : {};
  });

  const [expandedEmployees, setExpandedEmployees] = useState({});

  const categoryIcons = {
    development: <Target className="w-5 h-5" />,
    leadership: <Users className="w-5 h-5" />,
    technical: <BarChart className="w-5 h-5" />,
    "soft-skills": <Award className="w-5 h-5" />,
  };

  const toggleEmployee = (employeeId) => {
    setExpandedEmployees((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const handleAddGoal = () => {
    if (
      !selectedEmployee ||
      !goalFormData.description ||
      !goalFormData.weightage
    )
      return;
    const employeeName = employees.find(
      (e) => e.employeeId === selectedEmployee
    )?.empName;

    if (editingGoal) {
      setEmployeeGoals((prev) => ({
        ...prev,
        [selectedEmployee]: prev[selectedEmployee].map((goal) =>
          goal.id === editingGoal.id ? { ...goal, ...goalFormData } : goal
        ),
      }));
      setEditingGoal(null);
    } else {
      setEmployeeGoals((prev) => {
        const newGoal = {
          ...goalFormData,
          id: Date.now(),
          employeeName,
          employeeId: selectedEmployee,
        };
        const updatedGoals = {
          ...prev,
          [selectedEmployee]: [...(prev[selectedEmployee] || []), newGoal],
        };
        localStorage.setItem("employeeGoals", JSON.stringify(updatedGoals));
        return updatedGoals;
      });
    }

    setGoalFormData({
      employeeId: "",
      empName: "",
      description: "",
      category: "development",
      weightage: "",
      deadline: "",
    });
    setShowGoalForm(false);
  };

  useEffect(() => {
    const allEmployees = async () => {
      const managerName = localStorage.getItem("empName");
      if (managerName) {
        try {
          const response = await axios.get(
            `http://localhost:3003/employees/${managerName}`
          );
          response.data.data.forEach((employee) =>
            fetchGoals(employee.employeeId)
          );
          setEmployees(response.data.data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      }
    };
    allEmployees();
  }, []);

  const handleEditGoal = (employeeId, goal) => {
    setSelectedEmployee(employeeId);
    setEditingGoal(goal);
    setGoalFormData({
      employeeId,
      empName: goal.empName,
      description: goal.description,
      category: goal.category,
      weightage: goal.weightage,
      deadline: goal.deadline,
    });
    setShowGoalForm(true);
  };

  const fetchGoals = async (employeeId) => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/goals/${employeeId}`
        );
        setGoals((prevGoals) => ({
          ...prevGoals,
          [employeeId]: response.data.data,
        }));
        console.log("Goals getting:", response.data);
      } catch (error) {
        console.error("Error fetching goals details:", error);
      }
    }
  };

  const handleSubmitConfirm = (employeeId) => {
    setEmployeeToSubmit(employeeId);
    setShowConfirmDialog(true);
  };

  const handleSubmitGoals = async () => {
    if (!employeeToSubmit) return;

    setSubmitting((prev) => ({ ...prev, [employeeToSubmit]: true }));
    try {
      const goals = employeeGoals[employeeToSubmit] || [];
      const response = await axios.post(
        `http://localhost:3003/goals/${employeeToSubmit}`,
        { goals }
      );

      setSubmittedEmployees((prev) => {
        const newSubmitted = [...prev, employeeToSubmit];
        localStorage.setItem(
          "submittedEmployees",
          JSON.stringify(newSubmitted)
        );
        return newSubmitted;
      });

      // Clear goals for this employee after successful submission
      setEmployeeGoals((prev) => {
        const newGoals = { ...prev };
        delete newGoals[employeeToSubmit];
        localStorage.setItem("employeeGoals", JSON.stringify(newGoals));
        return newGoals;
      });
    } catch (error) {
      console.error("Error submitting goals:", error);
    } finally {
      setSubmitting({});
      setShowConfirmDialog(false);
      setEmployeeToSubmit(null);
    }
  };

  return (
    <div className="justify-center items-start mt-20 ml-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600">
          Team Performance Management
        </h1>
        <p className="text-gray-600 mt-2">
          Set and track meaningful goals for your team members
        </p>
      </div>

      <div className="space-y-6">
      <div className="space-y-6">
  {employees.map((employee) => (
    <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => toggleEmployee(employee.employeeId)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-800 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{employee.empName}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Award className="w-4 h-4 mr-1" />
              <span>{employee.designation}</span>
              <span className="mx-2">•</span>
              <span>{employee.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {(!submittedEmployees.includes(employee.employeeId) ) && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEmployee(employee.employeeId);
                  setEditingGoal(null);
                  setShowGoalForm(true);
                }}
                className="flex items-center px-4 py-2 text-sm font-medium bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitConfirm(employee.employeeId);
                }}
                disabled={submitting[employee.employeeId]}
                className="flex items-center px-4 py-2 text-sm bg-white border border-cyan-800 text-cyan-800 font-medium rounded-lg hover:bg-cyan-700 hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Goals
              </button>
            </>
          )}
          {goals[employee.employeeId]?.length > 0 && submittedEmployees.includes(employee.employeeId) ? (
            <span className="text-green-600 font-medium flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Goals Submitted
            </span>
          ) : null}
          {expandedEmployees[employee.employeeId] ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </div>

                {expandedEmployees[employee.employeeId] && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    {goals[employee.employeeId]?.length > 0 ||
                    submittedEmployees.includes(employee.employeeId) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals[employee.employeeId]?.map((goal) => (
                          <div
                            key={goal.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <div className="p-2 bg-blue-50 rounded-lg">
                                    {categoryIcons[goal.category]}
                                  </div>
                                  <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                                    {goal.category}
                                  </span>
                                </div>
                                {!submittedEmployees.includes(
                                  employee.employeeId
                                ) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditGoal(employee.employeeId, goal);
                                    }}
                                    className="p-2 text-gray-400 hover:text-cyan-900 transition-colors duration-200"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                )}
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
                                    Due:{" "}
                                    {new Date(
                                      goal.deadline
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">
                          No goals set for this employee yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {editingGoal ? "Edit Goal" : "Set New Goal"} for{" "}
                {
                  employees.find((e) => e.employeeId === selectedEmployee)
                    ?.empName
                }
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={goalFormData.category}
                    onChange={(e) =>
                      setGoalFormData({
                        ...goalFormData,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="development">Development</option>
                    <option value="leadership">Leadership</option>
                    <option value="technical">Technical</option>
                    <option value="soft-skills">Soft Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none"
                    value={goalFormData.description}
                    onChange={(e) =>
                      setGoalFormData({
                        ...goalFormData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Enter goal description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (%)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      value={goalFormData.weightage}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          weightage: e.target.value,
                        })
                      }
                      min="0"
                      max="100"
                      placeholder="Enter weightage..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={goalFormData.deadline}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-800 rounded-lg hover:bg-cyan-700"
                >
                  {editingGoal ? "Update Goal" : "Add Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submit Goals
              </h3>
              <p className="text-gray-600">
                Are you sure you want to submit these goals? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGoals}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-800 rounded-lg hover:bg-cyan-700 flex items-center"
                disabled={submitting[employeeToSubmit]}
              >
                {submitting[employeeToSubmit] ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Confirm Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_Goals;
