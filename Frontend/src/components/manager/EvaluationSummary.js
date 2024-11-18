// import React, { useState , useEffect} from 'react';
// import axios from 'axios';
// import { Save ,User, Briefcase, TrendingUp } from 'lucide-react';

// const PerformanceAssessment = () => {
//   const [ReviewData, setReviewData] = useState({
//     employeeName: '',
//     employeeId: '',
//     department: '',
//     assessmentPeriod: '',
//     ratings: {
//       productivity: '',
//       quality: '',
//       teamwork: '',
//       communication: '',
//       initiative: ''
//     },
//     strengths: '',
//     areasForImprovement: '',
//     goalsAchieved: '',
//     futureObjectives: '',
//     overallRating: '',
//     additionalComments: ''
//   });


  

//   const [submitted, setSubmitted] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setReviewData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setReviewData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//     console.log('Assessment submitted:', ReviewData);
//   };

//   const ratingOptions = [
//     { value: '5', label: 'Outstanding', color: 'bg-green-100' },
//     { value: '4', label: 'Exceeds Expectations', color: 'bg-blue-100' },
//     { value: '3', label: 'Meets Expectations', color: 'bg-yellow-100' },
//     { value: '2', label: 'Needs Improvement', color: 'bg-orange-100' },
//     { value: '1', label: 'Unsatisfactory', color: 'bg-red-100' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="container mx-auto max-w-4xl bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
//           <h1 className="text-2xl font-bold text-center">
//             Annual Employee Performance Assessment
//           </h1>
//         </div>
        
//         <div className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 text-blue-800">Employee Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Employee Name</label>
//                   <input
//                     type="text"
//                     name="employeeName"
//                     value={ReviewData.employeeName}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Employee ID</label>
//                   <input
//                     type="text"
//                     name="employeeId"
//                     value={ReviewData.employeeId}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Department</label>
//                   <input
//                     type="text"
//                     name="department"
//                     value={ReviewData.department}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Assessment Period</label>
//                   <input
//                     type="text"
//                     name="assessmentPeriod"
//                     value={ReviewData.assessmentPeriod}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     placeholder="e.g., FY 2023-24"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Performance Ratings */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 text-blue-800">Performance Ratings</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.keys(ReviewData.ratings).map((category) => (
//                   <div key={category} className="relative">
//                     <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
//                       {category}
//                     </label>
//                     <select
//                       name={`ratings.${category}`}
//                       value={ReviewData.ratings[category]}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
//                       required
//                     >
//                       <option value="">Select Rating</option>
//                       {ratingOptions.map((option) => (
//                         <option 
//                           key={option.value} 
//                           value={option.value}
//                           className={option.color}
//                         >
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
//                       <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                         <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
//                       </svg>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Detailed Feedback */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 text-blue-800">Detailed Feedback</h3>
//               <div className="space-y-4">
//                 {['strengths', 'areasForImprovement', 'goalsAchieved', 'futureObjectives'].map((field) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
//                       {field.replace(/([A-Z])/g, ' $1').trim()}
//                     </label>
//                     <textarea
//                       name={field}
//                       value={ReviewData[field]}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
//                       required
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Overall Assessment */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 text-blue-800">Overall Assessment</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Overall Rating</label>
//                   <select
//                     name="overallRating"
//                     value={ReviewData.overallRating}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                     required
//                   >
//                     <option value="">Select Overall Rating</option>
//                     {ratingOptions.map((option) => (
//                       <option 
//                         key={option.value} 
//                         value={option.value}
//                         className={option.color}
//                       >
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-gray-700">Additional Comments</label>
//                   <textarea
//                     name="additionalComments"
//                     value={ReviewData.additionalComments}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               <Save className="w-5 h-5" />
//               Submit Assessment
//             </button>
//           </form>

//           {submitted && (
//             <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
//               <p className="flex items-center gap-2">
//                 <svg className="w-5 h-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
//                   <path d="M5 13l4 4L19 7"></path>
//                 </svg>
//                 Assessment has been successfully submitted!
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PerformanceAssessment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, Briefcase, TrendingUp } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// const AppraisalHeader = () => {
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  

//   useEffect(() => {
//     const fetchAppraisalDetails = async () => {
//       if (!employeeId || !timePeriod) {
//         setError('Employee ID or time period not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
//         );

//         const initialFormData = {
//           empName: response.data[0]?.empName || '',
//           designation: response.data[0]?.designation || '',
//           managerName: response.data[0]?.managerName || '',
//           timePeriod: response.data[0]?.timePeriod || timePeriod,
//           status: response.data[0]?.status || ''
//         };

//         setFormData(initialFormData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching appraisal details:', error);
//         setError('Error fetching appraisal details');
//         setLoading(false);
//       }
//     };

//     fetchAppraisalDetails();
//   }, [employeeId, timePeriod]);

//   if (loading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600 text-center p-4">{error}</div>;
//   }

//   return (
//     <>
//       <div className="mb-2">
//         <div className="bg-blue-600 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-white">Appraisal Details</h1>
//             {formData ? (
//               <div className="flex items-center gap-2">
//                 <span className="text-sm bg-blue-50 text-blue-600 px-3 py-2 font-medium rounded">
//                   {new Date(timePeriod[0]).toISOString().slice(0, 10)} to{' '}
//                   {new Date(timePeriod[1]).toISOString().slice(0, 10)}
//                 </span>
//               </div>
//             ) : (
//               <div />
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         {formData ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
//             {/* Employee Name Card */}
//             <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//               <div className="p-3 bg-blue-100 rounded-lg shrink-0">
//                 <User className="text-blue-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Employee Name</p>
//                 <p className="font-medium text-gray-900">{formData.empName}</p>
//               </div>
//             </div>

//             {/* Designation Card */}
//             <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//               <div className="p-3 bg-purple-100 rounded-lg shrink-0">
//                 <Briefcase className="text-purple-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Designation</p>
//                 <p className="font-medium text-gray-900">{formData.designation}</p>
//               </div>
//             </div>

//             {/* Manager Name Card */}
//             <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//               <div className="p-3 bg-green-100 rounded-lg shrink-0">
//                 <User className="text-green-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Manager Name</p>
//                 <p className="font-medium text-gray-900">{formData.managerName}</p>
//               </div>
//             </div>

//             {/* Evaluation Status Card */}
//             <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
//               <div className="p-3 bg-orange-100 rounded-lg shrink-0">
//                 <TrendingUp className="text-orange-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
//                 <p className="font-medium text-gray-900">-</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div />
//         )}
//       </div>
//     </>
//   );
// };

const EvaluationSummary = () => {
  const [ReviewData, setReviewData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    assessmentPeriod: '',
    ratings: {
      productivity: '',
      quality: '',
      teamwork: '',
      communication: '',
      initiative: ''
    },
    strengths: '',
    areasForImprovement: '',
    goalsAchieved: '',
    futureObjectives: '',
    overallRating: '',
    additionalComments: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();
  const { timePeriod } = location.state || {}
  const { employeeId } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setReviewData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setReviewData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Assessment submitted:', ReviewData);
  };

  const ratingOptions = [
    { value: '5', label: 'Outstanding', color: 'bg-green-100' },
    { value: '4', label: 'Exceeds Expectations', color: 'bg-blue-100' },
    { value: '3', label: 'Meets Expectations', color: 'bg-yellow-100' },
    { value: '2', label: 'Needs Improvement', color: 'bg-orange-100' },
    { value: '1', label: 'Unsatisfactory', color: 'bg-red-100' }
  ];

  // Sample time period for AppraisalHeader
  const sampleTimePeriod = ['2024-01-01', '2024-12-31'];

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      if (!employeeId || !timePeriod) {
        setError('Employee ID or time period not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );

        const initialFormData = {
          empName: response.data[0]?.empName || '',
          designation: response.data[0]?.designation || '',
          managerName: response.data[0]?.managerName || '',
          timePeriod: response.data[0]?.timePeriod || timePeriod,
          status: response.data[0]?.status || ''
        };

        setFormData(initialFormData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appraisal details:', error);
        setError('Error fetching appraisal details');
        setLoading(false);
      }
    };

    fetchAppraisalDetails();
  }, [employeeId, timePeriod]);

  const handleBack = () => {
    navigate(`/evaluationView1/${employeeId}`,{state:{timePeriod}});
};

const handleContinue = () => {
    navigate(`/manager-performance`,{state:{timePeriod}}); 
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      {/* <div className="container mx-auto  bg-white/90 backdrop-blur-sm rounded-lg shadow-xl"> */}
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-2 mb-1 mt-14 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Overall FeedBack</h1>
            {formData ? (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-blue-50 text-cyan-800 px-3 py-2 font-medium rounded">
                  {new Date(timePeriod[0]).toISOString().slice(0, 10)} to{' '}
                  {new Date(timePeriod[1]).toISOString().slice(0, 10)}
                </span>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <div >
        {formData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
            {/* Employee Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{formData.empName}</p>
              </div>
            </div>

            {/* Designation Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{formData.designation}</p>
              </div>
            </div>

            {/* Manager Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{formData.managerName}</p>
              </div>
            </div>

            {/* Evaluation Status Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
                <p className="font-medium text-gray-900">-</p>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    
  
        
        <div className="p-6 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            {/* <div className="bg-gray-50 p-6 rounded-lg shadow-sm"> */}
              {/* <h3 className="text-lg font-semibold mb-4 text-blue-800">Employee Information</h3> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={ReviewData.employeeName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={ReviewData.employeeId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={ReviewData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Assessment Period</label>
                  <input
                    type="text"
                    name="assessmentPeriod"
                    value={ReviewData.assessmentPeriod}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., FY 2023-24"
                    required
                  />
                </div>
              </div> */}
            {/* </div> */}

            {/* Performance Ratings */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Performance Ratings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(ReviewData.ratings).map((category) => (
                  <div key={category} className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
                      {category}
                    </label>
                    <select
                      name={`ratings.${category}`}
                      value={ReviewData.ratings[category]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                      required
                    >
                      <option value="">Select Rating</option>
                      {ratingOptions.map((option) => (
                        <option 
                          key={option.value} 
                          value={option.value}
                          className={option.color}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
                      <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Detailed Feedback</h3>
              <div className="space-y-4">
                {['strengths', 'areasForImprovement', 'goalsAchieved', 'futureObjectives'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <textarea
                      name={field}
                      value={ReviewData[field]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Assessment */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Overall Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Overall Rating</label>
                  <select
                    name="overallRating"
                    value={ReviewData.overallRating}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select Overall Rating</option>
                    {ratingOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        className={option.color}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Additional Comments</label>
                  <textarea
                    name="additionalComments"
                    value={ReviewData.additionalComments}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              Submit Assessment
            </button> */}
            <div className="mt-6 flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
          {/* <div className='mr-4'>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div> */}

          <div>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
          </form>

          {/* {submitted && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Assessment has been successfully submitted!
              </p>
            </div>
          )} */}
        </div>
      {/* </div> */}
    </div>
  );
};

export default EvaluationSummary;