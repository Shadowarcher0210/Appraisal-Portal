import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { Calendar, Target } from 'lucide-react';
import TeamMembersSidebar from '../manager/TeamMembers';

const DashboardHR = () => {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [employees, setEmployees] = useState([]);

    const employeeName = localStorage.getItem('empName');
    const navigate = useNavigate();
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
    const appraisalStartDate = new Date(`${currentYear}-04-01`).toLocaleDateString('en-CA');
    const appraisalEndDate = new Date(`${currentYear + 1}-03-31`).toLocaleDateString('en-CA');
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
  useEffect(() => {
    fetchAppraisalDetails();
    // allEmployees();
  }, []);
    const handleButtonClick = async (appraisal) => {
        const { timePeriod, status } = appraisal;
        const employeeId = localStorage.getItem('employeeId')?.trim();
        const newStatus = status === "Submitted" ? "Submitted" : "In Progress";
        const navigatePath = status === "Submitted" ? `/empview/${employeeId}` : "/hr-Form";

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
            console.error(`Error updating status to ${newStatus}:, error`);
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
            <div className='w-full'>

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
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Manager name</th>

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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{appraisal.managerName}</td>

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

            {/* <TeamMembersSidebar employees={employees} /> */}
        </div>

    )
}

export default DashboardHR