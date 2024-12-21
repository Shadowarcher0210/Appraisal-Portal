import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  User, Activity } from "lucide-react";
import axios from 'axios';

const M_Performance = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const managerName = localStorage.getItem('empName');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const years = [];

    for (let i = startYear; i <= currentYear; i++) {
      years.push(`${i}-${i + 1}`);
    }
    setAcademicYears(years);

    const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
    setSelectedYear(`${defaultYear}-${defaultYear + 1}`);

    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAllAppraisalDetails = async () => {
    const [yearStart] = selectedYear.split('-');
    const startDate = `${yearStart}-04-01`;
    const endDate = `${parseInt(yearStart) + 1}-03-31`;
    
    try {
      const response = await axios.get(
        `http://localhost:3003/appraisal/allAppraisals/${managerName}/${startDate}/${endDate}`
      );
      
      const allAppraisals = response.data.data;
      if (allAppraisals && allAppraisals.length > 0) {
        const sortedAppraisals = allAppraisals.sort((a, b) => {
          if (a.status === "Submitted" || a.status === "Under Review") return -1;
          if (b.status === "Submitted" || b.status === "Under Review") return 1;
          return 0;
        });
        setAppraisals(sortedAppraisals);
      } else {
        setAppraisals([]);
      }
    } catch (error) {
      console.error('Error fetching appraisals:', error);
      setAppraisals([]);
    }
  };

  useEffect(() => {
    if (selectedYear && managerName) {
      fetchAllAppraisalDetails();
    }
  }, [selectedYear, managerName]);

  const handleViewClick = async (appraisal) => {
    const { employeeId, timePeriod, status } = appraisal;
    
    if (status === "Submitted") {
      try {
        const response = await axios.put(
          `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
          { status: "Under Review" }
        );

        if (response.status === 200) {
          fetchAllAppraisalDetails();
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }

    if (status === "Submitted" || status === "Under Review") {
      navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
    } else if (status === "Under HR Review") {
      navigate(`/empview/${employeeId}`, { state: { timePeriod } });
    } else if (status === "Completed") {
      navigate(`/CE/${employeeId}`, { state: { timePeriod } });
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
      "To Do": "bg-yellow-100 text-yellow-800"
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-blue-50 mt-10">
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-2">
    <label className="text-4xl font-bold text-yellow-200 block">
    Appraisal Insights for the team
    </label>
    <p className="text-white font-medium block mt-2">
    Key metrics and trends to guide your Team progress.
    </p>
  </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="p-2">
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <Activity className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-blue-900">
                  Team Appraisals Overview
                </h2>
              </div>
            </div>

         
  <div className="relative mx-4 my-1">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-2 shadow-sm">
        <div className="flex items-start">
          <span className="text-red-600 font-semibold mr-2">*Note:</span>
          <p className="text-red-700">
            If you need to make any changes for your employee's appraisal after submission, 
            please reach out to your HR department for assistance.
          </p>
        </div>
      </div>
    </div>
         
    <div className="mt-6 px-4">
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-all duration-200">
            <div className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 rounded-l-lg">
              <label 
                htmlFor="time-period" 
                className="text-sm font-medium text-gray-700"
              >
                Time Period
              </label>
            </div>
            <div className="relative">
              <select
                id="time-period"
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-transparent px-4 py-2.5 pr-8 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
              >
                {academicYears.map((year) => (
                  <option 
                    key={year} 
                    value={year}
                    className="text-gray-900 bg-white"
                  >
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Employee Name</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Assessment Year</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Manager</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Status</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-800 tracking-wider">Actions</th>
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
                            <span className="text-gray-700">{appraisal.empName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {appraisal.timePeriod ? `${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{appraisal.managerName || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-sm rounded-md font-medium ${getStatusStyle(appraisal.status)}`}>
                            {appraisal.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">
                          <button
                            className={`bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-2 py-1.5 w-20 
                              ${appraisal.status === "Under HR Review" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={appraisal.status === "Under HR Review"}
                            onClick={() => handleViewClick(appraisal)}
                          >
                            {appraisal.status === "Completed" ? "View" : "Review"}
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

export default M_Performance;