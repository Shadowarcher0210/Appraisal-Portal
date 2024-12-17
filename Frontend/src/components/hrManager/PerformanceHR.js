
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PerformanceHR = () => {
//     const [selectedYear, setSelectedYear] = useState('');
//     const [selectedManager, setSelectedManager] = useState('');

//     const [academicYears, setAcademicYears] = useState([]);
//     const [appraisals, setAppraisals] = useState([]);
//     const [uniqueManagers, setUniqueManagers] = useState([]);
//     const navigate = useNavigate();
// const [allEmployees,setAllEmployees]= useState([]);
//     const [selectedEmployees, setSelectedEmployees] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [timePeriod, setTimePeriod] = useState(['', '']);
//     const [selectionType, setSelectionType] = useState('none');
//     const handleEmployeeChange = (e) => {
//         const { value } = e.target;
//         setSelectedEmployees([value]);
//         setSelectionType('individual');
//     };
//     const handleSelectAll = (checked) => {
//         if (checked) {
//             const allEmployeeIds = employees.map((employee) => employee.id.toString());
//             setSelectedEmployees(allEmployeeIds);
//             setSelectionType('all');
//         } else {
//             setSelectedEmployees([]);
//             setSelectionType('individual');
//         }
//     };

//     const handleCreateClick = async () => {
      
//         try {
//             const response = await axios.get('http://localhost:3003/appraisal/allEmployees');4
//             setAllEmployees(response.data)
//             console.log("All Employees ",response.data)
//             console.log('Create successful:', response.data);
//             setShowPopup(false);
//         } catch (error) {
//             console.error('Error creating appraisal:', error);
//         }
//     };


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
//         const yearString = `${defaultYear}-${defaultYear + 1}`;
//         setSelectedYear(yearString);

//         // Initial data fetch
//         if (managerName) {
//             fetchAllAppraisalDetails(yearString);
//         }
//     }, [managerName]);

//     const fetchAllAppraisalDetails = async (year) => {
//         const [yearStart] = (year || selectedYear).split('-');
//         const startDate = `${yearStart}-04-01`;
//         const endDate = `${parseInt(yearStart) + 1}-03-31`;

//         try {
//             const response = await axios.get(
//                 `http://localhost:3003/appraisal/allAppraisals/${startDate}/${endDate}`
//             );

//             console.log('Appraisals response:', response.data);

//             let allAppraisals = response.data.data || [];

//             // Extract unique managers
//             const managers = [...new Set(allAppraisals.map(appraisal => appraisal.managerName).filter(Boolean))];
//             console.log('Unique Managers:', managers);
//             setUniqueManagers(managers);

//             // Filter by manager if selected
//             if (selectedManager) {
//                 allAppraisals = allAppraisals.filter(
//                     appraisal => appraisal.managerName === selectedManager
//                 );
//             }

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
//         } catch (error) {
//             console.error('Error fetching appraisals in Performance page:', error);
//             // Optionally set an error state or show a user-friendly message
//             setAppraisals([]);
//             setUniqueManagers([]);
//         }
//     };

//     useEffect(() => {
//         if (selectedYear) {
//             fetchAllAppraisalDetails();
//         }
//     }, [selectedYear, selectedManager]);

//     const handleViewClick = async (appraisal) => {
//         const { employeeId, timePeriod, status } = appraisal;

//         if (status === "Under HR Review") {
//             try {
//                 const response = await axios.put(
//                     `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
//                     { status: "Under HR Review" }
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

//         if (status === "Under HR Review") {
//             navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
//         } else if (status === "Completed") {
//             // navigate(`/hr-view/${employeeId}`, { state: { timePeriod } });
//             navigate(`/CE/${employeeId}`, { state: { timePeriod } });
//         }
//     };

//     const formatDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

//     return (
//         <div className="justify-center items-start mt-20 ml-6">
//             <div>
//                 <label className='ml-2 text-3xl font-bold text-orange-600'>Performance Insights</label>
//                 <p className='ml-4 mt-3 text-gray-800 font-medium'>Key metrics and trends to guide your Team progress.</p>
//             </div>

//             <div className="flex justify-between items-center">
//                 <div className='mt-2 ml-2 flex space-x-4'>
//                     <div className='border-black border-1 rounded-full py-1 px-9 bg-slate-100'>
//                         <label htmlFor="time-period" className="mr-2">Time Period:</label>
//                         <select
//                             id="time-period"
//                             value={selectedYear || ''}
//                             onChange={(e) => setSelectedYear(e.target.value)}
//                             className="bg-transparent"
//                         >
//                             {academicYears.map((year) => (
//                                 <option key={year} value={year}>
//                                     {year}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="border-black border-1 rounded-full py-1 px-9 bg-slate-100">
//                         <label htmlFor="reporting-manager" className="mr-2">Reporting Manager:</label>
//                         <select
//                             id="reporting-manager"
//                             value={selectedManager || ''}
//                             onChange={(e) => setSelectedManager(e.target.value)}
//                             className="bg-transparent"
//                         >
//                             <option value="">All Managers</option>
//                             {uniqueManagers.map((manager) => (
//                                 <option key={manager} value={manager}>
//                                     {manager}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="mr-10">
//                     <button
//                         className="bg-orange-300 text-white px-3 py-2 rounded hover:bg-orange-600"
//                         onClick={() => setShowPopup(true)}
//                     >
//                         Create Appraisal
//                     </button>
//                 </div>

//                 {showPopup && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
//                         <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 h-4/5 overflow-hidden flex flex-col">
//                             <h2 className="text-2xl font-bold mb-6 text-center">Create Appraisal</h2>
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-2">Time Period</label>
//                                 <div className="flex space-x-4">
//                                     <input
//                                         type="date"
//                                         value={timePeriod[0]}
//                                         onChange={(e) => setTimePeriod([e.target.value, timePeriod[1]])}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded"
//                                     />
//                                     <input
//                                         type="date"
//                                         value={timePeriod[1]}
//                                         onChange={(e) => setTimePeriod([timePeriod[0], e.target.value])}
//                                         className="w-full px-4 py-2 border border-gray-300 rounded"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex-grow overflow-y-auto mb-6">
//                                 <label className="block text-sm font-medium mb-4">Employees</label>
//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div className="col-span-3 mb-4 bg-orange-100 p-3 rounded-md -ml-3">
//                                         <label className="inline-flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 checked={selectionType === 'all'}
//                                                 onChange={(e) => handleSelectAll(e.target.checked)}
//                                                 className="mr-2"
//                                             />
//                                             Select All Employees
//                                         </label>
//                                     </div>
//                                     {employees.map((employee) => (
//                                         <label key={employee.id} className="inline-flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 value={employee.id}
//                                                 checked={
//                                                     selectionType === 'all' ||
//                                                     selectedEmployees.includes(employee.id.toString())
//                                                 }
//                                                 onChange={handleEmployeeChange}
//                                                 className="mr-2"
//                                             />
//                                             {employee.name}
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="flex justify-end space-x-4 mt-3">
//                                 <button
//                                     onClick={() => setShowPopup(false)}
//                                     className="bg-gray-300 text-black px-4 py-2 rounded"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleCreateClick}
//                                     className="bg-orange-600 text-white px-4 py-2 rounded"
//                                 >
//                                     Create
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//             </div>




//             <div className="flex-1 p-2 mt-5 overflow-hidden max-h-full">
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
//                                             {appraisal.empName || 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
//                                             {appraisal.timePeriod ? `${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])}` : 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
//                                             {appraisal.managerName || 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`inline-flex items-center  py-1.5 px-2 rounded-lg text-sm font-medium
//                                             ${appraisal.status === "Completed" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                 {appraisal.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-blue-700 cursor-pointer">
//                                             <button
//                                                 className={`bg-cyan-800 text-white hover:bg-cyan-700 rounded-md px-2 py-2 w-16 ${appraisal.status === "Under HR Review" ? '' : 'cursor-pointer'}`}
//                                                 onClick={() => handleViewClick(appraisal)}
//                                             >
//                                                 {appraisal.status === "Under HR Review" ? "Review" : "View"}
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
//                                         No appraisals found for this period.
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

// export default PerformanceHR;

import React from 'react'

const PerformanceHR = () => {
  return (
    <div>PerformanceHR</div>
  )
}

export default PerformanceHR