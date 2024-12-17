// import React, { useState, useEffect } from 'react';


// const applications = [
//   { id: 1, name: 'App 1', createdDate: '2022-06-15' },
//   { id: 2, name: 'App 2', createdDate: '2023-01-30' },
//   { id: 3, name: 'App 3', createdDate: '2023-04-10' },
//   { id: 4, name: 'App 4', createdDate: '2024-02-20' },
//   { id: 5, name: 'App 5', createdDate: '2024-04-05' },
// ];

// const getAcademicYearRange = (year) => {
//   const start = new Date(year, 3, 1);
//   const end = new Date(year + 1, 2, 31, 23, 59, 59);
//   return { start, end };
// };

// const PerformancePage = () => {
//   const [filteredApps, setFilteredApps] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [academicYears, setAcademicYears] = useState([]);

//   useEffect(() => {

//     const currentYear = new Date().getFullYear();
//     const startYear = currentYear - 3;
//     const years = [];

//     for (let i = startYear; i <= currentYear; i++) {
//       years.push(`${i}-${i + 1}`);
//     }
//     setAcademicYears(years);


//     const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
//     setSelectedYear(`${defaultYear}-${defaultYear + 1}`);
//   }, []);

//   useEffect(() => {
//     if (selectedYear) {

//       const startYear = parseInt(selectedYear.split('-')[0], 10);
//       const { start, end } = getAcademicYearRange(startYear);


//       const filtered = applications.filter((app) => {
//         const appDate = new Date(app.createdDate);
//         return appDate >= start && appDate <= end;
//       });

//       setFilteredApps(filtered);
//     }
//   }, [selectedYear]);

//   return (
//     <div className='ml-28 mt-20 '>
//       <div>
//         <div>
//           <label className='border-black border-1 rounded-full py-1 px-9 bg-slate-100'>
//             <label htmlFor="time-period" className=''>Time Period : </label>
//             <select
//               id="time-period"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//             >
//               {academicYears.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <br></br>
//           <hr></hr>
//           <br></br>
//           <div>
//             <h2 className='font-bold'>Appraisal</h2>
//             <text>Your performance appraisals for the selected time period are displayed below. Click on the View or edit appraisal button to complete your self appraisal (if applicable) or view the ratings given by your manager (once ready to be viewed)</text>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Time Period</th>
//                   <th>Manager</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>


//                 {filteredApps.length > 0 ? (
//                   filteredApps.map((app) => (
//                     <li key={app.id}>
//                       {app.name} - {app.createdDate}
//                     </li>
//                   ))
//                 ) : (
//                   <li>No applications found for the selected academic year.</li>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <br></br>
//         <hr></hr>
//         <br></br>
//       </div>
//     </div>
//   );
// };

// export default PerformancePage;