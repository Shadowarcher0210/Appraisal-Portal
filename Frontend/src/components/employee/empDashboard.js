import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../hrManager/Modal';
import axios from 'axios';
import { Calendar, Clock, User } from "lucide-react";

const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const employeeName = localStorage.getItem('empName');
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const navigate = useNavigate();
  const appraisalStartDate = new Date(`${currentYear}-04-01`).toLocaleDateString('en-CA');
  const appraisalEndDate = new Date(`${currentYear + 1}-03-31`).toLocaleDateString('en-CA');
  const appraisalDueDate = new Date(`${currentYear}-03-15`);
  const appraisalVisibleStart = new Date(`${currentYear}-03-01`);
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

  useEffect(() => {
    fetchAppraisalDetails();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000); 
    return () => clearInterval(timer);
  }, []);

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
  
    console.log("Status in EMP Dashboard", status);
    
    let navigatePath = "";
    
    if (status === "Submitted") {
      navigatePath = `/empview/${employeeId}`;
    } else if (status === "In Progress" ) {
      navigatePath = `/form`;
    } else if (status === "Completed") {
      navigatePath = `/CE/${employeeId}`;
    }
  
    if (status === "To Do") {
      try {
        const response = await axios.put(
          `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
          { status: "In Progress" }
        );
  
        if (response.status === 200) {
          console.log(`Status updated to In Progress successfully:`, response.data);
          fetchAppraisalDetails(); // Fetch updated data after status change
        } else {
          console.error('Failed to update status:', response.statusText);
        }
      } catch (error) {
        console.error(`Error updating status:`, error);
      }
      navigatePath = `/form`;
    }
  
    navigate(navigatePath, { state: { timePeriod } });
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with improved layout */}
      <div className="px-8 py-16 pt-20  bg-white ">
        <div className=" mx-auto">
          <div className="flex items-baseline space-x-2">
            <h1 className="text-4xl font-bold">{wishing()}</h1>
            <h2 className="text-3xl font-bold text-orange-600">{employeeName}</h2>
          </div>
          <div className="flex items-center mt-3 text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatDate(date)}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(date)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="  px-8 -mt-12">
        {/* Cards Grid with improved spacing */}
        <div className=" ">
               {/* Appraisal Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8  border-b">
          <div className=" py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-white bg-blue-500 p-3 rounded">Appraisal</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assessment Year</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Initiated On</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Manager name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData ? (
                  userData.map((appraisal, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{appraisal.empName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appraisal.timePeriod[0]} - {appraisal.timePeriod[1]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appraisal.initiatedOn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appraisal.managerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center  py-1.5 px-2 rounded-lg text-sm font-medium
                          ${appraisal.status === "Submitted" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {appraisal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  <button 
 className={`bg-blue-500 text-white rounded-md px-4 py-2 text-sm transition-colors 
  ${["Under Review", "Under HR Review"].includes(appraisal.status) 
      ? "opacity-50 cursor-not-allowed bg-blue-300" 
      : "hover:bg-blue-600" 
  }`}   
   onClick={() => handleButtonClick(appraisal)}
    disabled={["Under Review", "Under HR Review"].includes(appraisal.status)}
  >
    {["Submitted", "Under Review", "Under HR Review","Completed"].includes(appraisal.status) ? "View" : "Edit"}
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
          </div>
        </div>
          {/* Appraisal Cycle Card */}
          <div className="bg-white rounded-lg border border-gray-200 border-l-8 border-l-orange-300 shadow-sm hover:shadow-md transition-shadow w-80">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="font-semibold text-gray-800">Appraisal Cycle</h2><br/>
               
              </div>
              <div className="space-y-3">
                {currentDate >= appraisalVisibleStart && currentDate <= appraisalDueDate ? (
                  <div className="bg-orange-50 rounded-md p-4">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-800">{appraisalDueDate.toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 rounded-md p-4">
                    <p className="text-sm text-gray-600 mb-2">Cycle Period</p>
                    
                    <p className="font-medium text-gray-700">{appraisalStartDate} to {appraisalEndDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;