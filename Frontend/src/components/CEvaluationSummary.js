import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  User, Briefcase, TrendingUp } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from "../assets/delete.svg"

const CEvaluationSummary = () => {
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
  const [email, setEmail] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [downloadError, setDownloadError] = useState(null);


  const [tableData, setTableData] = useState([
    { 
      id: 1, 
      category: 'Employee Self Appraisal', 
      weightage: '10%', 
      attainment: '' 
    },
    { 
      id: 2, 
      category: 'Employee Goals', 
      weightage: '35%', 
      attainment: '' 
    },
    { 
      id: 3, 
      category: 'Additional Areas of Assessment', 
      weightage: '25%', 
      attainment: '' 
    },
    { 
      id: 4, 
      category: 'Manager Rating', 
      weightage: '30%', 
      attainment: '' 
    },
    { 
      id: 4, 
      category: 'Overall Weightage', 
      weightage: '100%', 
      attainment: '' 
    }
  ]);

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
  const token = localStorage.getItem('token');
  const empType = localStorage.getItem('empType');
  const [overallEvaluationData, setOverallEvaluationData] = useState(null);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmitted(true);
  //   console.log('Assessment submitted:', ReviewData);
  // };

  const ratingOptions = [
    { value: '5', label: 'Outstanding' },
    { value: '4', label: 'Exceeds Expectations' },
    { value: '3', label: 'Meets Expectations' },
    { value: '2', label: 'Needs Improvement' },
    { value: '1', label: 'Unsatisfactory' }
  ];

  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      if (!employeeId || !timePeriod) {
        setError('Employee ID or time period not found');
        setLoading(false);
        return;
      }

      try {
        const formResponse = await axios.get(
          `http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );
        console.log('Form Response Data:', formResponse.data);

        const initialFormData = {
          empName: formResponse.data[0]?.empName || '',
          designation: formResponse.data[0]?.designation || '',
          managerName: formResponse.data[0]?.managerName || '',
          timePeriod: formResponse.data[0]?.timePeriod || timePeriod,
          status: formResponse.data[0]?.status || '',
          employeeId: formResponse.data[0]?.employeeId || '',
         
        };

        setFormData(initialFormData);

        const overallEvaluationResponse = await axios.get(
          `http://localhost:3003/appraisal/overAllEvaluation/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );
        console.log('Overall Evaluation Response Data:', overallEvaluationResponse.data);

        if (overallEvaluationResponse.data) {
          const evaluationData = overallEvaluationResponse.data;
        //  setOverallEvaluationData(evaluationData);
          

          const updatedTableData = [
            { 
              id: 1, 
              category: 'Employee Self Appraisal', 
              weightage: '10%', 
              attainment: evaluationData.selfAssesment || 'N/A'
            },
            { 
              id: 2, 
              category: 'Employee Goals', 
              weightage: '35%', 
              attainment: 'N/A'
            },
            { 
              id: 3, 
              category: 'Additional Areas of Assessment', 
              weightage: '25%', 
              attainment: evaluationData.additionalAreasOverall || 'N/A'
            },
            { 
              id: 4, 
              category: 'Manager Rating', 
              weightage: '30%', 
              attainment: evaluationData.managerRating || 'N/A'
            },
            { 
              id: 5, 
              category: 'Overall Weightage', 
              weightage: '100%', 
              attainment:  'N/A'
            }
          ];

          setTableData(updatedTableData);
          console.log("table data", tableData[0])
        } else {
          console.log('No overall evaluation data found');
        }

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
    navigate(`/CE3/${employeeId}`, { state: { timePeriod } });
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
      let status;
  
      if (empType === 'HR') {
        status = 'Completed';
      } else {
        status = 'Under HR Review';
      }
  
      const response = await fetch(`http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
  
      if (response.ok) {
        console.log('Status updated successfully');
  
        const emailUrl = empType === 'HR' 
          ? 'http://localhost:3003/confirmationEmail/HRSubmitEmail'
          : 'http://localhost:3003/confirmationEmail/managerSubmitEmail';
  
        const emailResponse = await fetch(emailUrl, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId,
          }),
        });
  
        if (emailResponse.ok) {
          console.log('Email sent successfully');
        } else {
          const emailError = await emailResponse.json();
          console.log(`Error sending email: ${emailError.message}`);
        }
  
      } else {
        const errorData = await response.json();
        console.log(`Error updating status: ${errorData.error}`);
      }
  
    } catch (error) {
      console.error('Error updating status or sending email:', error);
    } finally {
      setIsModalOpen(false);
    }
  };
  
  const closeModal = () => setIsModalOpen(false);
  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    navigate("/employee-dashboard");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name); 
    }
  };

  const handleFileDelete = () => {
    setFileSelected(false);
    setFileName('');
  };

  
  const handleDownloadLetter = async () => {
    try {
      setDownloadError(null);
      const response = await axios.get(`http://localhost:3003/letter/fetch/${employeeId}`, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'evaluation_letter.pdf');
      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading letter:', error);
      setDownloadError('Failed to download the letter. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
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

      <div className="mb-6">
        {formData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{formData.empName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{formData.designation}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{formData.managerName}</p>
              </div>
            </div>

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

      <div className="space-y-4 mx-2 rounded-lg">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 ">
          <h2 className="text-xl font-bold text-cyan-800 mb-6 border-b pb-2 flex items-center gap-2">
            Performance Evaluation Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Assessment Category
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Weightage
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Attainment
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4 border text-gray-800 font-medium">
                      {row.category}
                    </td>
                    <td className="p-4 border text-gray-600">
                      {row.weightage}
                    </td>
                    <td className="p-4 border text-gray-600">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-semibold
                        ${row.attainment === 'N/A' 
                          ? 'bg-gray-100 text-gray-600' 
                          : (
                            parseFloat(row.attainment) >= 80 
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(row.attainment) >= 50 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          )
                        }
                      `}>
                        {row.attainment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

<div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mb-10 transform transition-all duration-300 hover:shadow-xl">
  <div className="flex items-center mb-4 border-b pb-4">
    <div className="bg-green-100 p-3 rounded-full mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-cyan-800">Your Performance Appraisal Letter</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
    <div className="space-y-2">
      <p className="text-gray-600 text-sm">
        Your comprehensive performance evaluation is now ready. Download your official appraisal letter to review your achievements, feedback, and professional growth insights.
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
        </svg>
        <span>PDF Document</span>
      </div>
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        className="
          px-8 py-3 
          bg-gradient-to-r from-green-500 to-green-600 
          text-white 
          rounded-lg 
          shadow-md 
          hover:shadow-lg 
          transform hover:-translate-y-1 
          transition-all 
          duration-300 
          flex 
          items-center 
          gap-3
          group
        "
        onClick={handleDownloadLetter}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 group-hover:animate-bounce" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        Download 
        <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded-full group-hover:animate-pulse">
          Letter
        </span>
      </button>
    </div>
  </div>

  {downloadError && (
    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{downloadError}</span>
    </div>
  )}
</div>



          <div className=" sticky flex justify-end">
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
                  navigate("/manager-dashboard");
                }}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CEvaluationSummary;