
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight, Activity, Target, ChevronDown, ChevronUp, BarChart } from "lucide-react";
import axios from 'axios';

const PerformanceHR = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [uniqueManagers, setUniqueManagers] = useState([]);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const AppraisalstartDate = `${currentYear}-04-01`;
  const AppraisalendDate = `${parseInt(currentYear) + 1}-03-31`;
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectionType, setSelectionType] = useState('none');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const years = [];

    for (let i = startYear; i <= currentYear; i++) {
      years.push(`${i}-${i + 1}`);
    }
    setAcademicYears(years);

    const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
    const yearString = `${defaultYear}-${defaultYear + 1}`;
    setSelectedYear(yearString);

    fetchAllAppraisalDetails(yearString);
    fetchEmployees();

    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3003/appraisal/allEmployees');
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const fetchAllAppraisalDetails = async (year) => {
    const [yearStart] = (year || selectedYear).split('-');
    const startDate = `${yearStart}-04-01`;
    const endDate = `${parseInt(yearStart) + 1}-03-31`;

    try {
      const response = await axios.get(
        `http://localhost:3003/appraisal/allAppraisals/${startDate}/${endDate}`
      );
      let allAppraisals = response.data.data || [];
      const managers = [
        ...new Set(allAppraisals.map((appraisal) => appraisal.managerName).filter(Boolean)),
      ];
      setUniqueManagers(managers);

      if (selectedManager) {
        allAppraisals = allAppraisals.filter(
          (appraisal) => appraisal.managerName === selectedManager
        );
      }

      const sortedAppraisals = allAppraisals.sort((a, b) => {
        if (a.status === 'Submitted' || a.status === 'Under Review') return -1;
        if (b.status === 'Submitted' || b.status === 'Under Review') return 1;
        return 0;
      });

      setAppraisals(sortedAppraisals);
    } catch (error) {
      console.error('Error fetching appraisals:', error);
      setAppraisals([]);
      setUniqueManagers([]);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchAllAppraisalDetails(selectedYear);
    }
  }, [selectedYear, selectedManager]);

  const handleViewClick = async (appraisal) => {
    const { employeeId, timePeriod, status } = appraisal;

    if (status === 'Pending HR Review') {
      try {
        const response = await axios.put(
          `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
          { status: 'Under HR Review' }
        );

        if (response.status === 200) {
          fetchAllAppraisalDetails();
        }
      } catch (error) {
        console.error('Error updating status to Under Review:', error);
      }
    }

    if (status === 'Under HR Review' || status === "Pending HR Review") {
      navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
    } else if (status === 'Completed') {
      navigate(`/hr-view/${employeeId}`, { state: { timePeriod } });
    }
  };

  const handleCreateClick = async () => {
    await fetchEmployees();
    const payload = {
      employeeId: selectedEmployees,
      timePeriod: [AppraisalstartDate, AppraisalendDate],
    };

    try {
      const response = await axios.post('http://localhost:3003/form/createAppraisal', payload);
      setShowPopup(false);
      setSelectedEmployees([]);
      setSelectionType('');

      if (response.data?.data?.length) {
        const messages = response.data.data
          .map((item) => `${item.employeeName || 'No name'} - ${item.message}`)
          .join('\n');
        setConfirmationMessage(messages);
        setShowPopup2(true);
      } else {
        const message = response.data.message || 'Appraisals processed successfully.';
        setConfirmationMessage(message);
      }

      const employeeIds = response.data.data?.map(item => item.employeeId) || [];
      if (employeeIds.length > 0) {
        await axios.post('http://localhost:3003/confirmationEmail/createAppraisalEmail', { employeeId: employeeIds });
      }
    } catch (error) {
      console.error('Error creating appraisal:', error);
      setConfirmationMessage('Failed to create appraisal(s). Please try again.');
      setShowPopup2(true);
    } finally {
      setShowPopup(false);
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectionType('all');
      setSelectedEmployees(employees.map((employee) => employee.employeeId));
    } else {
      setSelectionType('');
      setSelectedEmployees([]);
    }
  };

  const formatDate = (date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-CA');
    }
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

  const wishing = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
        <div className="mb-2">
    <label className="text-4xl font-bold text-yellow-200 block">
    Appraisal Insights for the team
    </label>
    <p className="text-white font-medium block mt-2">
    Key metrics and trends to guide your Team progress.
    </p>
  </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="">
           

<div className="p-6 space-y-6">
  <div className="flex flex-col bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
    <div className="flex items-center space-x-2">
      <Activity className="h-5 w-5 text-blue-500" />
      <h2 className="text-xl font-bold text-blue-900">Team Appraisals Overview</h2>
    </div>

    {/* Spacer that grows to push the button to the bottom */}
    <div className="flex-grow" />

    <button
      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors self-end -mt-7"
      onClick={() => setShowPopup(true)}
    >
      Create Appraisal
    </button>
  </div>
</div>



        {showPopup && (
         <div className="fixed inset-0 flex items-center justify-center  bg-blue-50 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 h-4/5 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Appraisal</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={AppraisalstartDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  value={AppraisalendDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          
            <div className="flex-grow overflow-y-auto mb-6">
              <label className="block text-sm font-medium mb-4">Employees</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 mb-4 bg-orange-100 p-3 rounded-md -ml-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectionType === 'all'}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="ml-2 mr-2"
                    />
                    Select All Employees
                  </label>
                </div>
                {employees.map((employee, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={employee.employeeId}
                      checked={selectedEmployees.includes(employee.employeeId)}
                      //onChange={(e) => handleEmployeeChange(e, employee.employeeId)}
                      onChange={(e) => {
                        const updatedSelection = e.target.checked
                          ? [...selectedEmployees, employee.employeeId]
                          : selectedEmployees.filter((id) => id !== employee.employeeId);
                        setSelectedEmployees(updatedSelection);
                      }}
                      className="mr-2"
                    />
                    {employee.empName}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-3">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClick}
                className="bg-orange-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
  
      {showPopup2 && (
        <div className="fixed inset-0 flex items-center justify-center  bg-blue-50 bg-opacity-50 mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto scrollbar-thin">
            <h2 className="text-xl font-semibold mb-4 text-center">Appraisal Status</h2>

            <div className="space-y-3">
              {confirmationMessage.split('\n').map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md ${
                    msg.toLowerCase().includes('already exists')
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {msg.toLowerCase().includes('already exists') ? (
                    <span className="font-bold">⚠️ Already Exists:</span>
                  ) : (
                    <span className="font-bold">✔️ Created:</span>
                  )}{' '}
                  {msg}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center w-full">
              <button
                onClick={() => setShowPopup2(false)}
                className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 w-48"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
            
          <div className="mt-1 ml-2 flex space-x-4">
          <div className="border-black border-1 rounded-lg  py-1 px-9 bg-yellow-100">
            <label htmlFor="time-period" className="mr-2">Time Period:</label>
            <select
              id="time-period"
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent"
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="border-black border-1 rounded-lg  py-1 px-9 bg-yellow-100">
            <label htmlFor="reporting-manager" className="mr-2">Reporting Manager:</label>
            <select
              id="reporting-manager"
              value={selectedManager || ''}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="bg-transparent"
            >
              <option value="">All Managers</option>
              {uniqueManagers.map((manager) => (
                <option key={manager} value={manager}>
                  {manager}
                </option>
              ))}
            </select>
          </div>
        </div>
            <div className="overflow-x-auto mt-2">
              <table className="w-full">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-md font-medium text-gray-700 tracking-wider">Employee Name</th>
                    <th className="px-6 py-4 text-left text-md font-medium text-gray-700 tracking-wider">Assessment Year</th>
                    <th className="px-6 py-4 text-left text-md font-medium text-gray-700 tracking-wider">Manager</th>
                    <th className="px-6 py-4 text-left text-md font-medium text-gray-700 tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-md font-medium text-gray-700 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appraisals.length > 0 ? (
                    appraisals.map((appraisal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-gray-900">{appraisal.empName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {appraisal.timePeriod ? `${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{appraisal.managerName || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-sm rounded-md font-medium ${getStatusStyle(appraisal.status)}`}>
                            {appraisal.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-blue-700 cursor-pointer">
                          <button
                            className={` bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-2 py-1.5 w-20 ${appraisal.status === 'Under HR Review' ? '' : 'cursor-pointer'}`}
                            onClick={() => handleViewClick(appraisal)}
                          >
                            {["Pending HR Review","Under HR Review"].includes(appraisal.status) ? "Review" : "View"}
                           
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
                        No appraisals found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PerformanceHR;
