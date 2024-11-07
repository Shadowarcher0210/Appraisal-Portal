
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'
// import { Award, User, Briefcase, TrendingUp } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// const M_ViewPage = () => {
//   const [evaluations, setEvaluations] = useState({});
//   const [overallFeedback, setOverallFeedback] = useState('');
//   const [formData, setFormData] = useState(null);
//   const employeeId = localStorage.getItem('employeeId');
//   const currentYear = new Date().getFullYear() + 1;
//   const nextYear = currentYear + 1;
// const location = useLocation();
// const {timePeriod}=location.state || {}


//   const competencies = [
//     { question: 'Job-Specific Knowledge', answer: 'I possess and apply the expertise, experience, and background to achieve solid results.' },
//     { question: 'Team Work', answer: 'I work effectively and efficiently with team.' },
//     { question: 'Job-Specific Skills', answer: 'I demonstrate the aptitude and competence to carry out my job responsibilities.' },
//     { question: 'Adaptability', answer: 'I am flexible and receptive regarding new ideas and approaches.' },
//     { question: 'Leadership', answer: 'I like to take responsibility in managing the team.' },
//     { question: 'Collaboration', answer: 'I cultivate positive relationships. I am willing to learn from others.' },
//     { question: 'Communication', answer: 'I convey my thoughts clearly and respectfully.' },
//     { question: 'Time Management', answer: 'I complete my tasks on time. '},
//     { question: 'Results', answer: ' I identify goals that are aligned with the organizations strategic direction and achieve results accordingly.' },
//     { question: 'Creativity', answer: 'I look for solutions outside the work.' },
//     { question: 'Initiative', answer: 'I anticipate needs, solve problems, and take action, all without explicit instructions.' },
//     { question: 'Client Interaction', answer: 'I take the initiative to help shape events that will lead to the organizations success and showcase it to clients.' },
//     { question: 'Software Development', answer: 'I am committed to improving my knowledge and skills.' },
//     { question: 'Growth', answer: 'I am proactive in identifying areas for self-development.' },
//   ];
//   const handleWeightageChange = (competency, weightage) => {
//     const numWeightage = Math.min(Math.max(0, parseFloat(weightage) || 0), 10);
//     setEvaluations(prev => ({
//       ...prev,
//       [competency]: {
//         ...prev[competency],
//         weightage: numWeightage
//       }
//     }));
//   };

//   useEffect(()=>{
//     const appraisalDetails = async () => {
//       if (employeeId) {
//           try {
//               const response = await axios.get(`http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`);
//               setFormData(response.data);
//               console.log("formdata", response.data); 
//           } catch (error) {
//               console.error('Error fetching user details:', error);
//           }
//       } else {
//           console.log('User ID not found in local storage.');
//       }
//     };
//     appraisalDetails()
//      },[])

 
//   // Header and User Info Cards sections remain the same...
//   return (
//     <div className="min-h-screen bg-gray-100 p-4 w-full">
//       {/* Header Section */}
//       <div className="mb-2">
//         <div className="bg-blue-600 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-white">Appraisal Details</h1>
//             {formData ? (

// <div className="flex items-center gap-2">
//   <span className="text-sm bg-blue-50 text-blue-600  px-3 py-2 font-medium rounded">
//   {new Date(formData[0].timePeriod[0]).toISOString().slice(0, 10)} to {new Date(formData[0].timePeriod[1]).toISOString().slice(0, 10)}
//   </span>
 
// </div>
// ):(<div/>)}
//           </div>
//         </div>
//       </div>

//       {/* User Info Cards */}
//       <div className="mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
//           <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//             <div className="p-3 bg-blue-100 rounded-lg shrink-0">
//               <User className="text-blue-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-400 mb-1">Employee Name</p>
//               <p className="font-medium text-gray-900"></p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//             <div className="p-3 bg-purple-100 rounded-lg shrink-0">
//               <Briefcase className="text-purple-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-400 mb-1">Designation</p>
//               <p className="font-medium text-gray-900"></p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//             <div className="p-3 bg-green-100 rounded-lg shrink-0">
//               <User className="text-green-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-400 mb-1">Manager Name</p>
//               <p className="font-medium text-gray-900"></p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//             <div className="p-3 bg-orange-100 rounded-lg shrink-0">
//               <TrendingUp className="text-orange-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
//               <p className="font-medium text-gray-900"></p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-1 mx-2 h-auto transition-all duration-200 hover:shadow-lg">
//           <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
//             <Award size={24} className="text-blue-600" />
//             <span className="text-xl">Self Appraisal & Competencies</span>
//           </h2>
//           {competencies && (
//             <div className="px-2">
//               <div className="space-y-6">
//                 {competencies.map((item) => (
//                   <div key={item.category} className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors duration-200">
//                     <div className="space-y-4">
//                       {/* Category and Requirement */}
//                       <div className="border-b border-gray-100 pb-4">
//                         <h3 className="font-semibold text-blue-600 text-lg mb-2">{item.question}</h3>
//                         <p className="text-gray-600">{item.answer}</p>
//                       </div>

                    
//                      <div className="flex gap-4">
//   {/* Response Section */}
//   <div className="bg-gray-50 rounded-lg p-4">
//     <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
//       <span className="text-blue-600">●</span> Response:
//       <span className="ml-4 text-gray-600"></span>
//     </h4>
//   </div>

//   {/* Notes Section */}
//   <div className="bg-gray-50 rounded-lg p-4">
//     <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
//       <span className="text-blue-600">●</span> Notes:
//       <span className="ml-4 text-gray-600"></span>
//     </h4>
//   </div>
// </div>



//                       {/* Weightage Section */}
//                       <div className="flex justify-start items-center pt-2">
//                         <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
//                           <span className="text-sm font-medium text-gray-700">Enter your weightage:</span>
//                           <input
//                             type="number"
//                             min="0"
//                             max="10"
//                             className="border rounded-md p-2 w-16 h-8 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="0-10"
//                             onChange={(e) => handleWeightageChange(item.category, e.target.value)}
//                             value={evaluations[item.category]?.weightage || ''}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Overall Evaluation */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-1 mx-2 transition-all duration-200 hover:shadow-lg">
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
//             <TrendingUp size={20} />
//             Overall Evaluation
//           </h2>
//         </div>

//         <div className="flex items-start gap-4">
//           <textarea
//             placeholder="Provide overall feedback about the employee's performance, achievements, and areas for improvement..."
//             className="flex-1 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={4}
//             value={overallFeedback}
//             onChange={(e) => setOverallFeedback(e.target.value)}
//           />
          
//           <select
//             className="border rounded-lg p-2 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             onChange={(e) => setEvaluations(prev => ({
//               ...prev,
//               overallRating: e.target.value
//             }))}
//             value={evaluations.overallRating || ''}
//           >
//             <option value="">Select Rating</option>
//             <option value="Exceeds Expectations">Exceeds Expectations</option>
//             <option value="Meets Expectations">Meets Expectations</option>
//             <option value="Needs Improvement">Needs Improvement</option>
//           </select>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end items-center mt-6 mr-2">
//         <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default M_ViewPage;