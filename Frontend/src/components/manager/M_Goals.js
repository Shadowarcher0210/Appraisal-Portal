
import axios from "axios";
import React, { useState, useEffect } from "react";
import {ChevronDown, ChevronUp,Target, Plus, User, Send, Calendar, Award, BarChart, Edit2, Activity,} from "lucide-react";

const M_Goals = () => {
  const [categories, setCategories] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeToSubmit, setEmployeeToSubmit] = useState(null);
  const [submittedEmployees, setSubmittedEmployees] = useState([]);
  const [goals, setGoals] = useState({});
  const [goalsFetched, setGoalsFetched] = useState({});
  const [goalFormData, setGoalFormData] = useState({
    employeeId: "",
    empName: "",
    category: "",
    otherText: "",
    description: "",
    weightage: "",
    deadline: "",
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const appraisalStartDate = new Date(`${currentYear+1}-04-01`).toLocaleDateString('en-CA');
  const appraisalEndDate = new Date(`${currentYear + 2}-03-31`).toLocaleDateString('en-CA');

  const [employees, setEmployees] = useState([]);
  const [expandedEmployees, setExpandedEmployees] = useState({});

  const categoryIcons = {
    "Development": <Target className="w-5 h-5" />,
    "Leadership": <User className="w-5 h-5" />,
    "Technical": <BarChart className="w-5 h-5" />,
    "Soft Skills": <Award className="w-5 h-5" />,
    "Others": <Target className="w-5 h-5" />,
  };

  const toggleEmployee = (employeeId) => {
    setExpandedEmployees((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const handleAddGoal = () => {
    if (!selectedEmployee || !goalFormData.description || !goalFormData.weightage) return;
    const employeeName = employees.find((e) => e.employeeId === selectedEmployee)?.empName;

    if (editingGoal) {
      setGoals((prev) => ({
        ...prev,
        [selectedEmployee]: prev[selectedEmployee].map((goal) =>
          goal.id === editingGoal.id ? { ...goal, ...goalFormData } : goal
        ),
      }));
      setEditingGoal(null);
    } else {
      setGoals((prev) => {
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
        return updatedGoals;
      });
    }

    setGoalFormData({
      employeeId: "",
      empName: "",
      description: "",
      category: "",
      otherText: "",
      weightage: "",
      deadline: "",
    });
    setShowGoalForm(false);
  };

  const [empType] = useState("Employee");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/goals/categories/${empType}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddGoalClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setEditingGoal(null);
    setShowGoalForm(true);
    fetchCategories();
  };

  useEffect(() => {
    const submittedEmployeeIds = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('goalsSubmitted_') && localStorage.getItem(key) === 'true') {
        const employeeId = key.replace('goalsSubmitted_', '');
        submittedEmployeeIds.push(employeeId);
      }
    });
    setSubmittedEmployees(submittedEmployeeIds);
  }, []);

  useEffect(() => {
    const allEmployees = async () => {
      const managerName = localStorage.getItem("empName");
      if (managerName) {
        try {
          const response = await axios.get(`http://localhost:3003/employees/${managerName}`);
          response.data.data.forEach((employee) => fetchGoals(employee.employeeId));
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
      otherText: goal.otherText,
      weightage: goal.weightage,
      deadline: goal.deadline,
    });
    setShowGoalForm(true);
  };

  const fetchGoals = async (employeeId) => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/goals/${employeeId}/${appraisalStartDate}/${appraisalEndDate}`
        );
        setGoals((prevGoals) => ({
          ...prevGoals,
          [employeeId]: response.data.data[0].goals,
        }));
        setGoalsFetched((prev) => ({
          ...prev,
          [employeeId]: true,
        }));
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
      const employeeGoals = goals[employeeToSubmit] || [];
      const response = await axios.post(
        `http://localhost:3003/goals/${employeeToSubmit}/${appraisalStartDate}/${appraisalEndDate}`,
        { goals: employeeGoals }
      );

      setSubmittedEmployees((prev) => [...prev, employeeToSubmit]);
      localStorage.setItem(`goalsSubmitted_${employeeToSubmit}`, 'true');

      setGoals((prev) => {
        const newGoals = { ...prev };
        delete newGoals[employeeToSubmit];
        return newGoals;
      });
      
      fetchGoals(employeeToSubmit);

      const emailPayload = {
        employeeId: employeeToSubmit,
        goals: employeeGoals,
      };
      await axios.post("http://localhost:3003/confirmationEmail/goalSubmitEmail", emailPayload);
    } catch (error) {
      console.error("Error submitting goals:", error);
    } finally {
      setSubmitting({});
      setShowConfirmDialog(false);
      setEmployeeToSubmit(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 mt-10">
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-2">
              <h1 className="text-4xl font-bold text-yellow-200">
                Team Goals Management
              </h1>
              <p className="text-white font-medium mt-2">
                Set and track meaningful goals for your team members
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="p-4">
            <div className="p-2 space-y-6">
              
              <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 ">
                <Activity className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-blue-900">
                  Team Goals Overview
                </h2>
              </div>
              <div className="relative  my-1">
                <div className="bg-orange-50 border-l-4 border-orange-600 rounded-r-lg p-2 shadow-sm">
                  <div className="flex items-start">
                    <span className="text-orange-700 font-semibold mr-2">*Note:</span>
                    <p className="text-orange-700">
                    Ensure all employee goals are added before clicking on submit.                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {employees
                .sort((a, b) => a.empName.localeCompare(b.empName))
                .map((employee) => (
                  <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div
                      className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleEmployee(employee.employeeId)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white shadow-inner">
                          <User className="w-6 h-6 " />
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
                        {!submittedEmployees.includes(employee.employeeId) && !goalsFetched[employee.employeeId] && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddGoalClick(employee.employeeId);
                              }}
                              className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm " >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Goal
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubmitConfirm(employee.employeeId);
                              }}
                              disabled={submitting[employee.employeeId]}
                              className="flex items-center px-4 py-2 text-sm bg-orange-600 border border-orange-500 text-white font-medium rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Submit Goals
                            </button>
                          </>
                        )}

                        {submittedEmployees.includes(employee.employeeId) && goals[employee.employeeId]?.length > 0 && (
                          <span className="text-green-600 font-medium flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            {goals[employee.employeeId]?.[0]?.GoalStatus || 'Goals Submitted'}
                          </span>
                        )}

                        {expandedEmployees[employee.employeeId] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedEmployees[employee.employeeId] && (
                      <div className="p-6 border-t border-blue-100 bg-white">
                        {goals[employee.employeeId]?.length > 0 || submittedEmployees.includes(employee.employeeId) ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {goals[employee.employeeId]?.map((goal, index) => (
                              <div
                                key={index}
                                className="group bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                              >
                                <div className="p-6">
                                  <div className="flex  justify-between  items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="p-2 bg-white text-blue-900 rounded-lg">
                                        {categoryIcons[goal.category]}
                                      </div>
                                      <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                                        {goal.category === 'Others' ? goal.otherText : goal.category}
                                      </span>
                                    </div>
                                    {!submittedEmployees.includes(employee.employeeId) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditGoal(employee.employeeId, goal);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-900 transition-colors duration-200"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  <h4 className="text-md text-gray-700 mb-3 ml-2">
                                    {goal.description}
                                  </h4>

                                  <div className="flex flex-wrap justify-between gap-4 mt-4">
                                    <div className="flex items-center">
                                      <BarChart className="w-4 h-4 text-gray-800 mr-2" />
                                      <span className="text-sm font-medium text-gray-700">
                                        Weight: {goal.weightage}%
                                      </span>
                                    </div>

                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 text-gray-800 mr-2" />
                                  <span className="text-sm text-gray-700 font-medium">
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
            <div className="p-6 bg-gray-50 rounded-md">
              <h3 className="text-xl font-semibold  text-gray-900 mb-6">
                {editingGoal ? "Edit Goal" : "Set New Goal"} for{" "}
                {
                  employees.find((e) => e.employeeId === selectedEmployee)
                    ?.empName
                }
              </h3>
              <div className="space-y-4">
                
<div>
      <form>
        <div className="text-sm font-medium text-gray-700">
        <label htmlFor="category">Category:</label>
        </div>
        <select
          id="category"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
          value={goalFormData.category}
          onChange={(e) =>
            setGoalFormData({
              ...goalFormData,
              category: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {goalFormData.category === 'Others' && (
            <textarea
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Please specify..."
              value={goalFormData.otherText || ''}
              onChange={(e) =>
                setGoalFormData({
                  ...goalFormData,
                  otherText: e.target.value,
                })
              }
            ></textarea>
          )}
          </form>
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
                  className="px-4 py-2 text-sm font-medium text-blue-500 bg-white border border-blue-500 rounded-lg hover:text-blue-600 hover:border-blue-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submit Goals
              </h3>
              <p className="text-gray-600">
                Are you sure you want to submit these goals?
              </p>
            </div>

            <div className="flex justify-between space-x-3">
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
    </div>
    </div>
  );
};

export default M_Goals;