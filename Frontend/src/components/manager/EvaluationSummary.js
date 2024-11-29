// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Save, User, Briefcase, TrendingUp } from 'lucide-react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';

// const EvaluationSummary = () => {
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
//   const location = useLocation();
//   const { timePeriod } = location.state || {}
//   const { employeeId } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
 
//  const [formData, setFormData] = useState(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//  const navigate = useNavigate();


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


//   const handleSubmit =  (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//     console.log('Assessment submitted:', ReviewData);
//   };



//   const tableData = [
//     { id: 1, column1: 'Employee Self Appraisal', column2: '10%' },
//     { id: 2, column1: 'Employee Goals', column2: '35%' },
//     { id: 3, column1: 'Additional Areas of Assesment', column2: '25%' },
//     { id: 4, column1: 'Overall Weightage', column2: '100%' },
//   ];



//   useEffect(() => {
//     const fetchAppraisalDetails = async () => {
//       if (!employeeId || !timePeriod) {
//         setError('Employee ID or time period not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//          ` http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
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

//   const handleBack = () => {
//     navigate(`/evaluationView3/${employeeId}, { state: { timePeriod } }`);
//   };

  

//   if (loading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600 text-center p-4">{error}</div>;
//   }

  
  
//   const closeModal = () => setIsModalOpen(false);
//   const closeThankYouModal = () => {
//     setIsThankYouModalOpen(false);
//     navigate("/employee-dashboard");
//   };
  

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 w-full">
//       {/* <div className="container mx-auto  bg-white/90 backdrop-blur-sm rounded-lg shadow-xl"> */}
//       <div className="mb-2">
//         <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 w-full">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-white">Overall FeedBack</h1>
//             {formData ? (
//               <div className="flex items-center gap-2">
//                 <span className="text-sm bg-blue-50 text-cyan-800 px-3 py-2 font-medium rounded">
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

//       <div >
//         {formData ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full ">
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



//       <div className=" mt-4 mb-4  rounded-md ">

//       <div className="overflow-x-auto ">
//           <table className="w-full ">
           
//             <tbody>
//               {tableData.map((row) => (
//                 <tr key={row.id} className="hover:bg-gray-50 bg-white ">
//                   <td className="p-4 w-4/6 border">{row.column1}</td>
//                   <td className="p-4  w-4/6 border">{row.column2}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>


        
//         <form onSubmit={handleSubmit} className="space-y-6 mt-3">

//           <div className="mt-6 flex justify-end">
//             <div className='mr-auto'>
//               <button
//                 className="px-6 py-2 text-cyan-800 border border-cyan-800 bg-white rounded-lg"
//                 onClick={handleBack}
//               >
//                 Back
//               </button>
//             </div>

//             <div className='mr-2'>
//               <button
//                 className="px-6 py-2 text-white bg-orange-500 rounded-lg"
//                 onClick={handleSubmit}
//               >
//                 Save & Exit
//               </button>
//             </div>

//             <div>
//               <button
//             className={`px-6 py-2 text-white bg-cyan-800 rounded-lg
//              `}
//             onClick={() => setIsModalOpen(true)}
//           //  disabled={!isFormComplete()}
//           >
//             Submit
//           </button>

//             </div>
//           </div>
//         </form>
//       </div>
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 text-center">
//                 Submit Appraisal
//               </h2>

//               <p className="mt-3 text-gray-600 text-center">
//                 Are you sure you want to submit your appraisal?
//               </p>
//               <div className="mt-6 flex justify-center space-x-4">
//                 {/* <button
//                   className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                   onClick={() => handleSubmit()}
//                 >
//                   Yes
//                 </button> */}
//                 <button
//   className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//   onClick={() => {
//     // Handle the form submission logic
//     handleSubmit();
    
//     // Close the modal
//     setIsModalOpen(false);

//     // Redirect to the dashboard
//     navigate("/manager-dashboard");
//   }}
// >
//   Yes
// </button>


//                 <button
//                   className="px-4 py-2 w-1/2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//                   onClick={closeModal}
//                 >
//                   No
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>

//       )}
//       {isThankYouModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex p-4 justify-center items-center">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
//           <div className="p-6">
//           <h2 className="text-xl font-semibold text-gray-900 text-center">

//           Appraisal Submission Confirmation</h2>

//           <p className="my-3 text-gray-600 text-center">
//            Please check your email for further updates.
//             </p>
//             <div className="mt-6 flex justify-center">
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded w-3/4"
//                 onClick={closeThankYouModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EvaluationSummary;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, Briefcase, TrendingUp } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

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
  const { timePeriod } = location.state || {};
  const { employeeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

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
  const token = localStorage.getItem('token')
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Assessment submitted:', ReviewData);
  };

  const ratingOptions = [
    { value: '5', label: 'Outstanding' },
    { value: '4', label: 'Exceeds Expectations' },
    { value: '3', label: 'Meets Expectations' },
    { value: '2', label: 'Needs Improvement' },
    { value: '1', label: 'Unsatisfactory' }
  ];

  const tableData = [
    { id: 1, column1: 'Employee Self Appraisal', column2: '10%' },
    { id: 2, column1: 'Employee Goals', column2: '35%' },
    { id: 3, column1: 'Additional Areas of Assessment', column2: '25%' },
    { id: 4, column1: 'Overall Weightage', column2: '100%' },
  ];

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      if (!employeeId || !timePeriod) {
        setError('Employee ID or time period not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
         ` http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );

        const initialFormData = {
          empName: response.data[0]?.empName || '',
          designation: response.data[0]?.designation || '',
          managerName: response.data[0]?.managerName || '',
          timePeriod: response.data[0]?.timePeriod || timePeriod,
          status: response.data[0]?.status || '',
          employeeId:response.data[0]?.employeeId || '',
         
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
    navigate(`/evaluationView3/${employeeId}`, { state: { timePeriod } });
  };

  

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    setIsThankYouModalOpen(true);
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
    try {
      const employeeId = localStorage.getItem('employeeId');
      const response = await fetch(`http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`, {
        method: 'PUT',
        headers: {
          "content-Type": "application/json",
          "Authorization":` Bearer ${token}`,
        },
        // body: JSON.stringify({ pageData })
      })
      if (response.ok) {
        console.log('response', response); 
  
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);
      }
      const emailresponse = await fetch(`http://localhost:3003/confirmationEmail/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        }),
      });
      const emailData = await emailresponse.json();
      console.log(emailData.message);
  
    } catch (error) {
      console.error('Error updating status:', error);
    }
    finally {
      setIsModalOpen(false);
    }
  }
  
  const closeModal = () => setIsModalOpen(false);
  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    navigate("/employee-dashboard");
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Overall Feedback</h1>
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

      <div>
        {formData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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

      <div className="mt-4 mb-4 rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 bg-white">
                  <td className="p-4 w-4/6 border">{row.column1}</td>
                  <td className="p-4 w-4/6 border">{row.column2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-3">
          <div className="mt-6 flex justify-end">
            <div className='mr-auto'>
              <button
                type="button"
                className="px-6 py-2 text-cyan-800 border border-cyan-800 bg-white rounded-lg"
                onClick={handleBack}
              >
                Back
              </button>
            </div>

            <div className='mr-2'>
              <button
                type="button"
                className="px-6 py-2 text-white bg-orange-500 rounded-lg"
                onClick={() => {
                  // Logic for save and exit
                  navigate("/manager-dashboard");
                }}
              >
                Save & Exit
              </button>
            </div>

            <div>
              <button
            className={`px-6 py-2 text-white bg-cyan-800 rounded-lg
             `}
            onClick={() => setIsModalOpen(true)}
          //  disabled={!isFormComplete()}
          >
            Submit
          </button>

            </div>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Submit Appraisal
              </h2>

              <p className="mt-3 text-gray-600 text-center">
                Are you sure you want to submit your appraisal?
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  onClick={() => handleConfirmSubmit()}
                >
                  Yes
                </button>

                <button
                  className="px-4 py-2 w-1/2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={closeModal}
                >
                  No
                </button>
              </div>

            </div>
          </div>
        </div>

      )}
      {isThankYouModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex p-4 justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
          <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center">

          Appraisal Submission Confirmation</h2>

          <p className="my-3 text-gray-600 text-center">
           Please check your email for further updates.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-3/4"
                onClick={closeThankYouModal}
              >
                Close
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationSummary;