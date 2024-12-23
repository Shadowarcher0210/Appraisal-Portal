import React, { useState, useEffect } from "react";
import axios from "axios";
import {User, Briefcase,TrendingUp,BarChart,Calendar} from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import categoryIcons from "../utils/CategoryIcons";

const CEvaluation1 = () => {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [employeeGoals, setEmployeeGoals] = useState([]);
  const [managerEval, setManagerEval] = useState({});
  const startDate = new Date(`${currentYear}-04-01`).toLocaleDateString('en-CA');
  const endDate = new Date(`${currentYear+ 1}-03-31`).toLocaleDateString('en-CA');

  const [totalWeight, setTotalWeight] = useState(0);
  const [isWeightCalculationReady, setIsWeightCalculationReady] =  useState(false);

  const [managerWeightages, setManagerWeightages] = useState({});

  const handleWeightageChange = (goalId, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    if (numericValue !== null && (isNaN(numericValue) || numericValue < 0)) {
      setManagerWeightages((prev) => ({
        ...prev,
        [goalId]: null,
      }));
      return;
    }

    setManagerWeightages((prev) => ({
      ...prev,
      [goalId]: numericValue,
    }));
    console.log("manager weight", managerWeightages)


    const allWeightsAssigned = employeeGoals.every((goal) => {
      const weight = managerWeightages[goal._id];
      return (
        weight !== null &&
        weight !== undefined &&
        weight >= 0 &&
        weight <= goal.weightage
      );
    });
    setIsWeightCalculationReady(allWeightsAssigned);
  };
  

  useEffect(() => {
    const assignedWeights = employeeGoals.reduce((sum, goal) => {
      const weight = managerEval[goal._id];
      return sum + (weight !== null && !isNaN(weight) ? weight : 0);
    }, 0);

    const totalPossibleWeight = employeeGoals.reduce(
      (sum, goal) => sum + goal.weightage,
      0
    );

    setTotalWeight((assignedWeights / totalPossibleWeight) * 100);
  }, [managerEval, employeeGoals]);

  const calculateTotalWeight = () => {
    const totalPossibleWeight = employeeGoals.reduce(
      (sum, goal) => sum + goal.weightage, 0);

    const totalManagerWeight = Object.values(managerWeightages).reduce(
      (sum, weight) => {
        const numericWeight = parseFloat(weight);
        return isNaN(numericWeight) ? sum : sum + numericWeight;
      },0);
    if (totalManagerWeight <= totalPossibleWeight) {
      const percentageOutOf100 =
        (totalManagerWeight / totalPossibleWeight) * 100;
      const percentageOutOf35 = (percentageOutOf100 / 100) * 35;
      setTotalWeight(percentageOutOf35);
    } else {
      setTotalWeight(0);
    }
  };

  useEffect(() => {
    calculateTotalWeight();
  }, [employeeGoals, managerWeightages]);


  useEffect(() => {
    const initialWeightages = employeeGoals.reduce((acc, goal) => {
     acc[goal._id] = managerEval[goal._id] || null;
        return acc;
    }, {});
    setManagerWeightages(initialWeightages);
    setIsWeightCalculationReady(false);
}, [employeeGoals]);

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      if (!employeeId || !timePeriod) {
        setError('Employee ID or time period not found');
        setLoading(false);
        return;
      }
        try {
            const response = await axios.get(
              `http://localhost:3003/all/details/${employeeId}`
            );
            const initialFormData = {
                empName: response.data.user.empName || '',
                designation: response.data.user.designation || '',
                managerName: response.data.user.managerName || '',
                timePeriod: response.data.user.timePeriod || timePeriod,
                status: response.data[0]?.status || '',
              };
        console.log("res check for eval", initialFormData);
        setFormData([initialFormData]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appraisal details:', error);
        setError('Error fetching appraisal details');
        setLoading(false);
      }
    };
    fetchAppraisalDetails();
  }, [employeeId, timePeriod]);

  useEffect(() => {
    const initialWeightages = employeeGoals.reduce((acc, goal) => {
      acc[goal._id] = null;
      return acc;
    }, {});
    setManagerWeightages(initialWeightages);
    setIsWeightCalculationReady(false);
  }, [employeeGoals]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/all/details/${employeeId}`
        );
        setEmail(response.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };

  useEffect(() => {
  const fetchEmployeeGoals = async () => {
 
    try {
      const response = await axios.get(
        `http://localhost:3003/goals/${employeeId}/${startDate}/${endDate}`
      );
      const goals = response.data.data[0].goals; 
      setEmployeeGoals(goals || []);   

      const managerEvalData = {};
      goals.forEach((goal) => {
        managerEvalData[goal._id] = goal.managerWeightage; 
      });

      setManagerEval(managerEvalData);
      setManagerWeightages(managerEvalData); 
      console.log("checking manager eval", managerEval)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setLoading(false);
    }
  };
  fetchEmployeeGoals();
}, [employeeId, timePeriod]);

  const handleBack = () => {
    navigate(`/CE/${employeeId}`, { state: { timePeriod } });
  };

useEffect(() => {
    const fetchAppraisalDetails = async () => {
        if (!employeeId || !timePeriod) {
            setError('Employee ID or time period not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(
                ` http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
            );
            const initialFormData = {
                empName: response.data[0]?.empName || '',
                designation: response.data[0]?.designation || '',
                managerName: response.data[0]?.managerName || '',
                timePeriod: response.data[0]?.timePeriod || timePeriod,
                status: response.data[0]?.status || '',
                pageData: employeeGoals.map((employeeGoals, index) => ({
                    managerWeightages : response.data[0]?.pageData[index]?.managerWeightages || '',
                }))
            };
            setFormData([initialFormData]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appraisal details:', error);
            setError('Error fetching appraisal details');
            setLoading(false);
        }
    };

    fetchAppraisalDetails();
}, [employeeId, timePeriod]);

  const handleContinue = async () => {
    navigate(`/CE2/${employeeId}`, { state: { timePeriod } });
  };

  const previousYear = currentYear;

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-4 w-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
        <div className="mt-14">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Employee Goals for {previousYear}-{currentYear + 1}
                    </h1>
                    {formData && formData[0] ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm bg-white text-cyan-800 px-3 py-2 font-medium rounded">
                                {new Date(formData[0].timePeriod[0])
                                    .toISOString()
                                    .slice(0, 10)}{" "}
                                to{" "}
                                {new Date(formData[0].timePeriod[1])
                                    .toISOString()
                                    .slice(0, 10)}
                            </span>
                        </div>
                    ) : ( <div />
                 )}
                </div>
            </div>
        </div>
        <div className="mb-6">
            {formData && formData[0] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4 ">
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                         <User className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                          <p className="font-medium text-gray-900">{formData[0].empName} </p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                            <Briefcase className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Designation</p>
                            <p className="font-medium text-gray-900">
                                {formData[0].designation}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-green-100 rounded-lg shrink-0">
                          <User className="text-green-600" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                          <p className="font-medium text-gray-900"> {formData[0].managerName} </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                          <TrendingUp className="text-orange-600" size={24} />
                        </div>
                        <div>
                         <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
                          <p className="font-medium text-gray-900"> {totalWeight.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center">No employee data available.</div>
            )}
        </div>

        {employeeGoals.length > 0 ? (
            <div className="space-y-4 mx-2 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {employeeGoals.map((goal, index) => (
                        <div
                            key={goal._id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:scale-[1.02]" >
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                    {categoryIcons[goal.category]}
                                    </div>
                                    <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                                    {goal.category}
                                    </span>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                            {goal.description}
                            </h4>
                            <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                                <div className="flex items-center space-x-2">
                                    <BarChart className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        Weight: {goal.weightage}%
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm text-gray-600">
                                            Due: {new Date(goal.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <br></br>
                                <hr></hr>
                                <br></br>
                                <div>
                                <div className='-mb-2'>
                                  <h className="font-semibold text-md ">Managers Review</h>
                                </div>
                                <br></br>
                                <div>
                                  <div className="flex items-center gap-4 w-full">
                                     <label className="text-sm font-medium text-gray-700 -mt-4">Weight (%)</label>
                                        <div className="relative">
                                           <div className="w-32 p-2 border rounded mb-4 text-left bg-gray-100">
                                              {managerWeightages[goal._id] || `Max ${goal.weightage}%`}
                                           </div>
                                        </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                        ))}
                </div>
             </div>
            
        ) : (
            <div className="text-center text-gray-500 mt-8">
                <p>No goals available for this employee.</p>
            </div>
        )}

        <div className="sticky mt-12 flex justify-end">
            <div className="mr-auto">
                <button
                    className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
                    onClick={handleBack}>
                    Back
                </button>
            </div>
            <div>
                <button
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg"
                    onClick={handleContinue} >
                   Next
                </button>
            </div>
        </div>
    </div>
    )
 }

export default CEvaluation1;