import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Briefcase, TrendingUp } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const EvaluationView3 = () => {
  const [formData, setFormData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [managerRating, setManagerRating] = useState(null);
  const [additionalComments, setAdditionalComments] = useState(null);
  const [managerName, setManagerName] = useState(''); 

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { timePeriod } = location.state || {};

  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState({
    overallRating: '',
    additionalComments: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'overallRating') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue === '' || (parseInt(numericValue) <= 100)) {
        setReviewData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else {
      setReviewData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };




useEffect(() => {
  const fetchUserDetails = async () => {
    if (!employeeId || !timePeriod) {
      setError('Employee ID or time period not found');
      setLoading(false);
      return;
    }

    try {
      const detailsResponse = await axios.get(
        `http://localhost:3003/all/details/${employeeId}`
      );
      
      const userData = detailsResponse.data.user || {};
      setUserData(userData);
      setManagerName(userData.managerName || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error fetching user details');
    } finally {
      setLoading(false);
    }
  };

  if (employeeId && timePeriod) {
    fetchUserDetails();
  }
}, [employeeId, timePeriod]);

useEffect(() => {
  const fetchAppraisalEvaluation = async () => {
    if (!userData || !employeeId || !timePeriod || !managerName) {
      return; 
    }

    try {
      const evaluationResponse = await axios.get(
        `http://localhost:3003/appraisal/Evaluation/${employeeId}/${timePeriod[0]}/${timePeriod[1]}/${userData.managerName}`
      );

      const evaluationData = evaluationResponse.data || {};
      const initialFormData = {
        empName: userData.empName || '',
        designation: userData.designation || '',
        managerName: userData.managerName || '',
        timePeriod: userData.timePeriod || timePeriod,
        evaluationDetails: evaluationData.data || '',
      };

      setFormData(initialFormData);
      setManagerRating(evaluationData.data?.managerRating || ''); 
      setAdditionalComments(evaluationData.data?.additionalComments || ''); 
      console.log("Evaluation manager", initialFormData);
    } catch (error) {
      console.error('Error fetching appraisal evaluation:', error);
    }
  };

  fetchAppraisalEvaluation();
}, [userData, employeeId, timePeriod, managerName]); 

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  const handleBack = () => {
    navigate(`/evaluationView2/${employeeId}`, { state: { timePeriod } });
  };

 

  const handleContinue = async () => {
    const { overallrating, additionalComments } = reviewData;
   const managerName = userData.managerName
  
    try {
      const response = await axios.put(
        `http://localhost:3003/appraisal/managerEvaluation/${employeeId}/${timePeriod[0]}/${timePeriod[1]}/${managerName}`,
        {
          managerRating: overallrating, 
          additionalComments,

        }
      );
  
      console.log('Evaluation submitted successfully:', response.data);
      navigate(`/evaluationSummary/${employeeId}`, { state: { timePeriod } });
  
    } catch (error) {
      console.error('Error submitting evaluation:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleSaveExit = () =>{}  

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Manager Evaluation</h1>
            {formData && (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-blue-50 text-cyan-800 px-3 py-2 font-medium rounded">
                  {new Date(timePeriod[0]).toISOString().slice(0, 10)} to{' '}
                  {new Date(timePeriod[1]).toISOString().slice(0, 10)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {userData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{userData.empName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{userData.designation}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{userData.managerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
                <p className="font-medium text-gray-900">{managerRating}</p>
              </div>
            </div>

          </div>
        )}
      </div>
      

      <div className="bg-white p-4  rounded-md shadow-md mx-2">
        {/* <h3 className="text-lg font-semibold mb-4 text-blue-800">Overall Assessment</h3> */}
        <div className="space-y-4 ">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Manager Rating</label>
            <input
              type="text"
              name="overallrating"
              value={managerRating}
              onChange={handleInputChange}
              className=" p-2 border border-gray-300  rounded-md  transition-all"
              placeholder="Enter your rating"
              pattern="[0-9]*"
              inputMode="numeric"
            />
           
          </div>
          <div>
            <label className="block text-sm font-medium mb-4 text-gray-700">Additional Comments</label>
            <textarea
              name="additionalComments"
              value={additionalComments}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md transition-all h-24 resize-none"
              placeholder="Enter additional comments here..."
            />
          </div>
        </div>
      </div> 

      <div className="mt-36 sticky flex justify-end">
        <div className="mr-auto">
          <button
            className="px-6 py-2 text-cyan-800 border border-cyan-800 bg-white rounded-lg"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
        <div className='mr-2'>
            <button
              className="px-6 py-2 text-white bg-orange-500 rounded-lg"
              onClick={handleSaveExit}
            >
              Save & Exit
            </button>
          </div>
        <div>
          <button
            className="px-6 py-2 text-white bg-cyan-800 rounded-lg"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationView3;