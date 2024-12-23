
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  User,  Activity} from "lucide-react";
import axios from 'axios';

const PerformanceHR = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [uniqueManagers, setUniqueManagers] = useState([]);
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
      navigate(`/CE/${employeeId}`, { state: { timePeriod } });
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
  const CalendarIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
  );

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

          <div className="flex-grow" />

          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors self-end -mt-7"
            onClick={() => setShowPopup(true)}
          >
            Create Appraisal
          </button>
        </div>
      </div>



      { showPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">Create Appraisal</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Appraisal Period
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
              <CalendarIcon />
                <input
                  type="date"
                  value={AppraisalstartDate}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg "
                />
              </div>
              <div className="relative flex-1">
              <CalendarIcon />
                <input
                  type="date"
                  value={AppraisalendDate}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Employees
            </label>
            
            {/* Select All */}
            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === employees.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Select All Employees</span>
              </label>
            </div>

            {/* Employee Grid */}
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {employees.map((employee) => (
                  <label
                    key={employee.employeeId}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={employee.employeeId}
                      checked={selectedEmployees.includes(employee.employeeId)}
                      onChange={(e) => {
                        const updatedSelection = e.target.checked
                          ? [...selectedEmployees, employee.employeeId]
                          : selectedEmployees.filter((id) => id !== employee.employeeId);
                        setSelectedEmployees(updatedSelection);
                      }}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">{employee.empName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-4">
          <button
            onClick={() => setShowPopup(false)}
            className="px-8 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-400 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Create Appraisal
          </button>
        </div>
      </div>
    </div>
  )}

      {showPopup2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 mt-10">
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

<div className="mt-6 px-4">
  <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-all duration-200">
    <div className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 rounded-l-lg">
      <label 
        htmlFor="time-period" 
        className="text-sm font-medium text-gray-700"
      >
        Time Period
      </label>
    </div>
    <div className="">
      <select
        id="time-period"
        value={selectedYear || ''}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="px-4 py-2.5 pr-8 text-sm text-gray-900 font-medium "
      >
        {academicYears.map((year) => (
          <option 
            key={year} 
            value={year}
          >
            {year}
          </option>
        ))}
      </select>
     
    </div>
  </div>

  <div className="inline-flex ml-10 items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-all duration-200">
    <div className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 rounded-l-lg">
      <label 
        htmlFor="reporting-manager" 
        className="text-sm font-medium text-gray-700"
      >
        Reporting Manager
      </label>
    </div>
    <div className="">
      <select
        id="reporting-manager"
        value={selectedManager || ''}
        onChange={(e) => setSelectedManager(e.target.value)}
        className=" px-4 py-2.5 pr-8 text-sm text-gray-900 font-medium "
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
</div>


            <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr className="border-b border-gray-200">
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee name</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assessment Year</th>
                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Initiated On</th> */}
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Manager name</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                               </tr>
                </thead>
                <tbody className="divide-y bg-white divide-gray-200">
                  {appraisals.length > 0 ? (
                    appraisals.map((appraisal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700">{appraisal.empName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {appraisal.timePeriod ? `${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])}` : 'N/A'}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appraisal.initiatedOn}</td> */}

                        <td className="px-6 py-4 text-gray-700">{appraisal.managerName || 'N/A'}</td>
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
