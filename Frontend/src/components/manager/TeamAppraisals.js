// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion'

// const M_Performance = () => {
//     const [selectedYear, setSelectedYear] = useState('');
//     const [academicYears, setAcademicYears] = useState([]);
//     const [appraisals, setAppraisals] = useState([]);
//     const navigate = useNavigate();
//     const managerName = localStorage.getItem('empName');
//     useEffect(() => {
//         const currentYear = new Date().getFullYear();
//         const startYear = currentYear - 3;
//         const years = [];

//         for (let i = startYear; i <= currentYear; i++) {
//             years.push(`${i}-${i + 1}`);
//         }
//         setAcademicYears(years);

//         const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
//         setSelectedYear(`${defaultYear}-${defaultYear + 1}`);
//     }, []);
//     const fetchAllAppraisalDetails = async () => {
//         const [yearStart] = selectedYear.split('-');
//         const startDate = `${yearStart}-04-01`;
//         const endDate = `${parseInt(yearStart) + 1}-03-31`;
//         try {
//             const response = await axios.get(
//                 ` http://localhost:3003/appraisal/allAppraisals/${managerName}/${startDate}/${endDate}`
//             );
//             console.log('Fetched Appraisals in Performance Page:', response.data);
//             const allAppraisals = response.data.data
//             if(allAppraisals && allAppraisals.length>0){
//             const sortedAppraisals = allAppraisals.sort((a, b) => {
//                 if (a.status === "Submitted" || a.status === "Under Review") {
//                     return -1; // Move to the top
//                 }
//                 if (b.status === "Submitted" || b.status === "Under Review") {
//                     return 1; // Move to the top
//                 }
//                 return 0; // No change
//             });
//             setAppraisals(sortedAppraisals);
//         }else{
//             setAppraisals([])
//         }
//         } catch (error) {
//             console.error('Error fetching appraisals in Performance page:', error);
//             setAppraisals([])
//         }
//     };
//     useEffect(() => {
//         if (selectedYear && managerName) {
//             fetchAllAppraisalDetails();
//         }
//     }, [selectedYear,managerName]);
//     const handleViewClick = async (appraisal) => {
//         const { employeeId, timePeriod, status } = appraisal;
//         if (status === "Submitted") {
//             try {
//                 const response = await axios.put(
//                   `  http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
//                     { status: "Under Review" }
//                 );

//                 if (response.status === 200) {
//                     console.log('Status updated to Under Review:', response.data);
//                     fetchAllAppraisalDetails(); // Refresh the list after status update
//                 } else {
//                     console.error('Failed to update status:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error updating status to Under Review:', error);
//             }
//         }

//         if (status === "Submitted" || status === "Under Review") {
           
//             navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
//         } else if (status === "Under HR Review") {
//             navigate(`/empview/${employeeId}`, { state: { timePeriod } });
//         }else if(status === "Completed") {
//             navigate(`/CE/${employeeId}`, { state: { timePeriod } });
//         }
//     };

//     useEffect(() => {
//         console.log('Updated appraisals:', appraisals);
//     }, [appraisals]);

//     const formatDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

//     return (
//         <div className="justify-center items-start mt-20 ml-6">
//             <div>
//                 <label className='ml-2 text-3xl font-bold text-orange-600'>Appraisal Insights for the team</label>
//                 <p className='ml-4 mt-3 text-gray-800 font-medium'>Key metrics and trends to guide your Team progress.</p>
//             </div>

//             <div className='mt-2 ml-2'>
//                 <label className='border-black border-1 rounded-full py-1 px-9 bg-slate-100'>
//                     <label htmlFor="time-period">Time Period:</label>
//                     <select
//                         id="time-period"
//                         value={selectedYear || ''}
//                         onChange={(e) => setSelectedYear(e.target.value)}
//                     >
//                         {academicYears.map((year) => (
//                             <option key={year} value={year}>
//                                 {year}
//                             </option>
//                         ))}
//                     </select>
//                 </label>
//             </div>
//             <div className="overflow-hidden w-full relative mt-1">
//   <motion.div
//     className="flex mt-1"
//     animate={{
//         x: ['10%', '60%'],
//       transition: {
//         repeat: Infinity, 
//         duration: 10, 
//         ease: 'linear',
//       },
//     }}
//     style={{ width: '60%' }} 
//   >
//     <p className="whitespace-nowrap text-red-700 bg-yellow-100 underline mr-2">
//       *Note:  
//     </p>
//     <p className="whitespace-nowrap text-red-700">
//      If you need to make any changes for your employee's appraisal after submission, please reach out to your HR department for assistance.
//     </p>
//   </motion.div>
// </div>
//             <div className="flex-1 p-2  overflow-hidden max-h-full">
//                 <div className="w-12/12 p-3 bg-white border shadow-md rounded-md ml-2 mr-8">
//                     <h2 className="text-2xl font-bold text-white bg-cyan-800 p-2 rounded mb-4">Preceding Appraisals</h2>
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reporting Manager</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {appraisals.length > 0 ? (
//                                 appraisals.map((appraisal, index) => (
//                                     <tr key={index} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
//                                             {appraisal.empName}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
//                                             {appraisal.timePeriod ?` ${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])} `: 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
//                                             {appraisal.managerName}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`inline-flex items-center  py-1.5 px-2 rounded-lg text-sm font-medium
//                                             ${appraisal.status === "Completed" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                             {appraisal.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-blue-700 cursor-pointer">
//                                         <button
//                                             className={`bg-cyan-800 text-white hover:bg-cyan-700 rounded-md px-2 py-2 w-16 
//                                                 ${appraisal.status === "Under HR Review" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
//                                             `}
//                                             disabled={appraisal.status === "Under HR Review"}
//                                             onClick={() => handleViewClick(appraisal)}
//                                         >
//                                             {appraisal.status === "Completed" ? "View" : "Review"}
//                                         </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="px-6 py-4 text-center text-gray-900">
//                                         No appraisals found for this year.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default M_Performance;




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight, Activity, Target } from "lucide-react";
import axios from 'axios';
import { motion } from 'framer-motion';

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
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <Activity className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-blue-900">
                  Team Appraisals Overview
                </h2>
              </div>
            </div>

            <div className="overflow-hidden w-full relative mb-4 ml-56 -mt-3">
              
                <p className="whitespace-nowrap text-red-700  underline mr-2">
                  *Note:
                </p>
                <p className="whitespace-nowrap text-red-700 -mt-6 ml-14">
                  If you need to make any changes for your employee's appraisal after submission, please reach out to your HR department for assistance.
                </p>
             
            </div>

            <div className="mt-2 ml-2">
              <div className="border-black border-1 rounded-lg py-1 px-9 bg-yellow-100 inline-block">
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

export default TeamAppraisals;