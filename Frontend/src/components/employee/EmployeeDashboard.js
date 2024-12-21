import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../hrManager/Modal';
import axios from 'axios';
import { Calendar, Clock, User, ChevronRight, Activity } from "lucide-react";
import StatusTracker from './StatusTracker';

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
          .sort((a, b) => parseInt(a.timePeriod[0]) - parseInt(b.timePeriod[0]));
        setUserData(sortedData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchAppraisalDetails();
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const wishing = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const handleButtonClick = async (appraisal) => {
    const { timePeriod, status } = appraisal;
    const employeeId = localStorage.getItem('employeeId')?.trim();
    let navigatePath = "";

    if (["Submitted", "Under Review", "Pending HR Review", "Under HR Review"].includes(status)) {
      navigatePath = `/empview/${employeeId}`;
    } else if (status === "In Progress") {
      navigatePath = `/form?activeTab=1`;
    } else if (status === "Completed") {
      navigatePath = `/CE/${employeeId}`;
    }

    if (status === "To Do") {
      try {
        await axios.put(
          `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
          { status: "In Progress" }
        );
        fetchAppraisalDetails();
        navigatePath = `/form`;
      } catch (error) {
        console.error(`Error updating status:`, error);
      }
    }

    navigate(navigatePath, { state: { timePeriod } });
  };

  const getStatusStyle = (status) => {
    const styles = {
      "Submitted": "bg-blue-100 text-blue-700",
      "Under Review": "bg-purple-100 text-purple-700",
      "Under HR Review": "bg-orange-100 text-orange-700",
      "Completed": "bg-green-100 text-green-700",
      "In Progress": "bg-amber-100 text-amber-700",
      "To Do": "bg-yellow-100 text-yellow-800",
      "Pending HR Review": "bg-indigo-100 text-indigo-700",
      
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-blue-50 mt-10">
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg  shadow-lg mt-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
           
            <div>
              <div className="flex items-baseline space-x-3 mb-2  ">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-200">{wishing()},</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-white ">
                  {employeeName}
                </h2>
              </div>
              <div className="flex items-center text-white">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatDate(date)}</span>
                <span className="mx-2">•</span>
                <span>{formatTime(date)}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-700" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {currentDate >= appraisalVisibleStart && currentDate <= appraisalDueDate 
                      ? "Due Date" 
                      : "Appraisal Period"}
                  </p>
                  <p className="text-sm mt-1 font-semibold text-gray-600">
                    {currentDate >= appraisalVisibleStart && currentDate <= appraisalDueDate
                      ? appraisalDueDate.toLocaleDateString() 
                      : `${appraisalStartDate} to ${appraisalEndDate}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

     
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 space-y-4">
           
          <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <Activity className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold text-blue-900">
              Self Appraisal Overview
            </h2>
          </div>


            <div className="overflow-x-auto ">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                   <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Employee name</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800  tracking-wider">Assessment Year</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Initiated On</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800  tracking-wider">Manager</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800  tracking-wider">Status</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800  tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userData ? (
                    userData.map((appraisal, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className=" text-gray-700">{appraisal.empName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {appraisal.timePeriod[0]} - {appraisal.timePeriod[1]}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{appraisal.initiatedOn}</td>
                        <td className="px-6 py-4 text-gray-700">{appraisal.managerName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1  text-sm rounded-md font-medium ${getStatusStyle(appraisal.status)}`}>
                            {appraisal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleButtonClick(appraisal)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                          >
                          {
                            ["Submitted", "Under Review", "Under HR Review", "Completed"].includes(appraisal.status) 
                              ? "View" 
                              : appraisal.status === "In Progress" 
                                ? "Continue" 
                                : appraisal.status === "To Do" 
                                  ? "Start" 
                                  : "View"
                          }

                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No appraisals found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {userData && userData.length > 0 && (
              <div className='p-2'>
                <StatusTracker currentStatus={userData[0].status} />
              </div>
            )}
          </div>
         
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;