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
          <h2 className="text-xl font-semibold text-cyan-800 mb-6 border-b pb-2 flex items-center gap-2">
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

{empType === 'HR' && (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-10">
    <label
      htmlFor="file-upload"
      className="text-xl font-semibold text-cyan-800 mb-4 border-b pb-2 flex items-center"
    >
      Upload file
    </label>
    <div className="overflow-x-auto">
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        className="block w-full text-sm text-gray-800 file:border file:border-gray-300 file:bg-gray-100 file:px-12 file:py-2 file:rounded-md hover:file:bg-gray-200"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        onChange={handleFileChange}
      />
      {fileSelected && (
        <div className="flex items-center border-gray-300 pt-2">
           <div className="text-gray-800 text-sm">{fileSelected.name}</div>
          
          <button
            onClick={handleFileDelete}
            className="text-red-500 hover:text-red-700 items-end ml-96 -mt-14"
            aria-label="Delete file"
          >
            <img src={DeleteIcon} alt="delete" style={{ width: "20px" }} />
          </button>
         
         
        </div>
      )}
    </div>
  </div>
)}



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
                Return To Dashboard
              </button>
            </div>
          
            {/* <div>
              <button
                className={`px-6 py-2 text-white bg-cyan-800 rounded-lg`}
                onClick={() => setIsModalOpen(true)}
              >
                Submit
              </button>
            </div> */}
          </div>
      </div>

      {/* Confirmation Modal */}
      
      
    </div>
  );
};

export default CEvaluationSummary;