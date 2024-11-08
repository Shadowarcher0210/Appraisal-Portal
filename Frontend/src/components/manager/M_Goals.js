import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Target, Plus, Users, Send, Calendar, ArrowRight, Award, BarChart, Edit2 } from 'lucide-react';
import { useLocation } from "react-router-dom";

const M_Goals = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const[goals,setGoals]=useState([]);

  const [editingGoal, setEditingGoal] = useState(null);
  const [goalFormData, setGoalFormData] = useState({
    empName: 'Madhu',
    category: 'development',
    description: '',
    weightage: '',
    deadline: ''
  });
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [employees, setEmployees] = useState([]);

  const [employeeGoals, setEmployeeGoals] = useState(() => {
    const storedGoals = localStorage.getItem('employeeGoals');
    return storedGoals ? JSON.parse(storedGoals) : {};
  });

  
  const [expandedEmployees, setExpandedEmployees] = useState({});

  const categoryIcons = {
    development: <Target className="w-5 h-5" />,
    leadership: <Users className="w-5 h-5" />,
    technical: <BarChart className="w-5 h-5" />,
    'soft-skills': <Award className="w-5 h-5" />
  };
  
  const toggleEmployee = (employeeId) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const handleAddGoal = () => {
    if (!selectedEmployee || !goalFormData.description || !goalFormData.weightage) return;
    const employeeName = employees[selectedEmployee]?.employeeName; 
    if (editingGoal) {
      setEmployeeGoals(prev => ({
        ...prev,
        [selectedEmployee]: prev[selectedEmployee].map(goal => 
          goal.id === editingGoal.id ? { ...goal, ...goalFormData } : goal
        )
      }));

      setEditingGoal(null);
    } else {
      // setEmployeeGoals(prev => ({
      //   ...prev,
      //   [selectedEmployee]: [
      //     ...(prev[selectedEmployee] || []),
      //     {
      //       //id: Date.now(),
      //       ...goalFormData,
      //       employeeName
      //       // status: 'Not Started',
      //       // progress: 0,
      //       // created_at: new Date().toISOString()
      //     }
      //   ]
      // }));
      setEmployeeGoals(prev => {
        const updatedGoals = {
          ...prev,
          [selectedEmployee]: [
            ...(prev[selectedEmployee] || []),
            {
              ...goalFormData,
              employeeName
            }
          ]
        };
        localStorage.setItem('employeeGoals', JSON.stringify(updatedGoals));
        return updatedGoals;
      });
      
    }

    // setGoalFormData({
    //   empName: '',
    //   description: '',
    //   category: 'development',
    //   weightage: '',
    //   deadline: ''
    // });
    setShowGoalForm(false);
    //localStorage.setItem('employeeGoals', JSON.stringify(employeeGoals));
  };
  
  const fetchGoals = async (employeeId) => {
    if (employeeId) {
      try {
        const response = await axios.get(`http://localhost:3003/goals/${employeeId}`);
        setGoals(prevGoals => ({
          ...prevGoals,
          [employeeId]: response.data.data
        }));
        console.log("Goals getting:", response.data);
      } catch (error) {
        console.error("Error fetching goals details:", error);
      }
    }
  };
  
  useEffect(() => {
    const allEmployees = async () => {
      const managerName = localStorage.getItem('empName');
      if (managerName) {
        try {
          const response = await axios.get(`http://localhost:3003/employees/${managerName}`);
          setEmployees(response.data.data);
          response.data.data.forEach(employee => fetchGoals(employee.employeeId));
          console.log('Employee List :', response.data.data);
        } catch (error) {
          console.error('Error fetching employees in Dashboard page:', error);
        }
      }
    };
    allEmployees();
  }, []);
  

  const handleEditGoal = (employeeId, goal) => {
    setSelectedEmployee(employeeId);
    setEditingGoal(goal);
    setGoalFormData({
      empName: goal.empName,
      description: goal.description,
      category: goal.category,
      weightage: goal.weightage,
      deadline: goal.deadline
    });
    setShowGoalForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Started': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors['Not Started'];
  };

  const handleSubmitGoals = async () => {
    try {
        const employeeId = localStorage.getItem('employeeId');
        const allGoals = Object.values(employeeGoals).flatMap((goals) => goals);

        const response = await axios.post(`http://localhost:3003/goals/${employeeId}`, { goals: allGoals });
        console.log(response.data.message || 'Goals submitted successfully');
    } catch (error) {
        console.error('Error submitting goals:', error);
        console.log(error.response?.data?.message || 'Failed to submit goals. Please try again.');
    } finally {
        setSubmitting({});
    }
};


  return (
    <div className="justify-center items-start mt-20 ml-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600">Team Performance Management</h1>
        <p className="text-gray-600 mt-2">Set and track meaningful goals for your team members</p>
      </div>

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
                  <h3 className="font-semibold text-lg text-gray-800">
                    {employee.empName}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Award className="w-4 h-4 mr-1" />
                    <span>{employee.designation}</span>
                    <span className="mx-2">•</span>
                    <span>{employee.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
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
                {employeeGoals[employee.employeeId]?.length > 0 && (
                
                  <button
                      onClick={handleSubmitGoals}
                      disabled={Object.values(submitting).some((isSubmitting) => isSubmitting)}
                      className="flex items-center px-4 py-2 text-sm bg-white border border-cyan-800 text-cyan-800 font-medium rounded-lg hover:bg-cyan-700 hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {Object.values(submitting).some((isSubmitting) => isSubmitting)
                        ? 'Submitting...'
                        : 'Submit Goals'}
                    </button>
                )}
                {expandedEmployees[employee.employeeId] ? 
                  <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </div>
            </div>

            {expandedEmployees[employee.employeeId] && (
  <div className="p-6 border-t border-gray-100 bg-gray-50">
    {goals[employee.employeeId]?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals[employee.employeeId].map(goal => (
          <div key={goal.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGoal(employee.employeeId, goal);
                  }}
                  className="p-2 text-gray-400 hover:text-cyan-900 transition-colors duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-lg font-medium text-gray-900 mb-3 ">
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
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No goals set for this employee yet</p>
      </div>
    )}
  </div>
)}

          </div>
        ))}
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {editingGoal ? 'Edit Goal' : 'Set New Goal'} for {employees.find(e => e.id === selectedEmployee)?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={goalFormData.category}
                    onChange={e => setGoalFormData({...goalFormData, category: e.target.value})}
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
                    onChange={e => setGoalFormData({...goalFormData, description: e.target.value})}
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
                      className="w-full p-2 border rounded-lg "
                      value={goalFormData.weightage}
                      onChange={e => setGoalFormData({...goalFormData, weightage: e.target.value})}
                      min="0"
                      max="100"
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
                      onChange={e => setGoalFormData({...goalFormData, deadline: e.target.value})}
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
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 flex items-center"
                >
                    {editingGoal ? 'Save Changes' : 'Add Goal'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                </div>
            </div>
         </div>
        </div>
      )}
    </div>
  );
};

export default M_Goals;
