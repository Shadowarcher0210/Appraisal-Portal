import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../hrManager/Modal';

const M_Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  // const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [date] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const employeeName = localStorage.getItem('empName');

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

  useEffect(() => {
    fetchAppraisalDetails();
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

  // const handleMenuClick = (index) => {
  //   setOpenMenuIndex(openMenuIndex === index ? null : index);
  // };


  const handleButtonClick = async (appraisal) => {
    const { timePeriod, status } = appraisal;
    const employeeId = localStorage.getItem('employeeId')?.trim();
    const newStatus = status === "Submitted" ? "Submitted" : "In Progress";
    const navigatePath = status === "Submitted" ? `/empview?${employeeId}&${timePeriod[0]}&${timePeriod[1]}` : "/form";

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
  return (
    <div className="justify-center items-start mt-20 ml-6">
      <div>
        <label className='font-bold text-4xl w-full ml-2 mb-4'>{wishing()}</label>
        <label className='ml-2 text-3xl font-bold text-orange-600'>
          {employeeName}
        </label>
        <p className='ml-2 mt-3'>{formatDate(date)} <span> , </span>{formatTime(date)}</p>
      </div>
      <br />

      <div className="w-12/12 p-4 bg-white border shadow-md rounded-md ml-4 mr-8">
        <h2 className="text-2xl font-bold text-white bg-blue-600 p-2 rounded mb-4">Appraisal</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assessment Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Initiated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <button className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</button>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userData ? (
              userData.map((appraisal, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{appraisal.empName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {appraisal.timePeriod[0]} - {appraisal.timePeriod[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{appraisal.initiatedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{appraisal.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <button
                      className='bg-blue-500 text-white hover:bg-blue-600 rounded-md px-2 py-2 w-16'
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

      <div className="mt-8 ml-4 w-3/5 p-4 bg-white border shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-white bg-blue-600 p-2 rounded mb-4">Important Dates</h2>
        {currentDate >= appraisalVisibleStart && currentDate <= appraisalDueDate ? (
          <p className="text-md mb-2">
            <span className="font-medium text-gray-700">Please complete your appraisal before: </span>
            <span className="underline">{appraisalDueDate.toLocaleDateString()}</span>
          </p>
        ) : (
          <p className="text-md mb-2">
            <span className="font-medium p-2 text-gray-700">Appraisal Cycle: </span>
            <span className="">{appraisalStartDate} to {appraisalEndDate}</span>
          </p>
        )}

        {currentDate >= goalSettingVisibleStart && currentDate <= goalSettingDueDate ? (
          <p className="text-md mb-2">
            <span className="font-medium p-2 text-gray-700">Please complete your goal setting before: </span>
            <span className="underline">{goalSettingDueDate.toLocaleDateString()}</span>
          </p>
        ) : (
          <p className="text-md mb-2">
            <span className="font-medium p-2 text-gray-700">Goal Setting: </span>
            <span className="">{goalSettingStartDate} to {goalSettingEndDate}</span>
          </p>
        )}

        <p className="mt-6 text-sm p-2">
          Ensure your goals for the upcoming year are set during the designated period to align with organizational objectives.
        </p>
      </div>
    </div>
  )
}

export default M_Dashboard