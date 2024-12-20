import React, { useState, useEffect } from "react";
import axios from "axios";
import {User, Briefcase,TrendingUp,Target,Award,ChevronRight,Users,BarChart,Calendar,Calculator,} from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const CEvaluation1 = () => {
  const [userData , setUserData] = useState(null)
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [employeeGoals, setEmployeeGoals] = useState([]);


  const categoryIcons = {
    "Development": <Target className="w-5 h-5" />,
    "Leadership": <Users className="w-5 h-5" />,
    "Technical": <BarChart className="w-5 h-5" />,
    "Soft Skills": <Award className="w-5 h-5" />,
    "Others": <Target className="w-5 h-5" />,  
  };




  

useEffect(() => {
  fetchUserDetails();
}, []);


const fetchUserDetails = async () => {
  if (employeeId) {
    try {
      const response = await axios.get(
        `http://localhost:3003/form/userDetailsAppraisal/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
      )
      setUserData(response.data)
      console.log("User Details in evaluation view 1",response.data)
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  } else {
    console.log("User ID not found in local storage.");
  }
};
  



  useEffect(() => {
    fetchUserDetails();
  }, []);


 
  useEffect(() => {
  const fetchEmployeeGoals = async () => {
 
    try {
      const response = await axios.get(
        `http://localhost:3003/goals/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
      );
      const goals = response.data.data[0]; 
      setEmployeeGoals(goals || []);   
      console.log("Getting goals in CE1",response.data.data[0])

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



  const handleContinue = async () => {
    navigate(`/CE2/${employeeId}`, { state: { timePeriod } });
  };

 

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 w-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
        <div className="mb-2">
            <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Employee Goals for {currentYear}-{currentYear+1}
                    </h1>
                    {userData && userData[0] ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm bg-blue-50 text-cyan-800 px-3 py-2 font-medium rounded">
                                {new Date(userData[0].timePeriod[0])
                                    .toISOString()
                                    .slice(0, 10)}{" "}
                                to{" "}
                                {new Date(userData[0].timePeriod[1])
                                    .toISOString()
                                    .slice(0, 10)}
                            </span>
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>

        {/* Employee Details Section */}
        <div className="mb-6">
            {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4 ">
                    {/* Employee Name */}
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                            <User className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                            <p className="font-medium text-gray-900">
                                {userData.empName}
                            </p>
                        </div>
                    </div>

                    {/* Designation */}
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                            <Briefcase className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Designation</p>
                            <p className="font-medium text-gray-900">
                                {userData.designation}
                            </p>
                        </div>
                    </div>

                    {/* Manager Name */}
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-green-100 rounded-lg shrink-0">
                            <User className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                            <p className="font-medium text-gray-900">
                                {userData.managerName}
                            </p>
                        </div>
                    </div>

                    {/* Manager's Evaluation */}
                    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                        <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
                            <p className="font-medium text-gray-900"> {employeeGoals.overallGoalScore}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center">No employee data available.</div>
            )}
        </div>



        {/* Goals Section */}
        {employeeGoals.goals.length > 0 ? (
            <div className="space-y-4 mx-2 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {employeeGoals.goals.map((goal, index) => (
                        <div
                            key={goal._id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:scale-[1.02]"
                        >
                            {/* Goal Details */}
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
                                                {goal.managerWeightage}
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

        {/* Action Buttons */}
        <div className="sticky mt-20 flex justify-end">
            <div className="mr-auto">
                <button
                    className="px-6 py-2 bg-white border border-cyan-800 text-cyan-800 rounded-lg"
                    onClick={handleBack}
                >
                    Back
                </button>
            </div>
           
            <div>
                <button
                    className="px-6 py-2 text-white bg-cyan-800 rounded-lg"
                    onClick={handleContinue}
                >
                   Next
                </button>
            </div>
        </div>
    </div>
);

};

export default CEvaluation1;