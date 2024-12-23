import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp,  Award} from 'lucide-react';
import tick from '../../assets/tick.svg'
import { useLocation, useParams, useNavigate, json } from 'react-router-dom';
import { questionsAndAnswersEmployee } from '../utils/EmpAppraisalQuestions';

const CEvaluation = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const location = useLocation();
  const { timePeriod } = location.state || {}
  const empType = localStorage.getItem('empType')

  useEffect(() => {
    fetchuserDetails();
  }, []);

  const fetchuserDetails = async () => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/all/details/${employeeId}`
        );

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };

  const handleBack = () => {
    if(empType==='Manager') navigate('/manager-performance');
    else if(empType==='HR') navigate('/hr-performance')
    else  navigate('/employee-performance') 
  };

  const handleContinue =  async () => {
    navigate(`/CE1/${employeeId}`,{state:{timePeriod}}); 
  }

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
          pageData: questionsAndAnswersEmployee.map((qa, index) => ({
            questionId: (index + 1).toString(),
            answer: response.data[0]?.pageData[index]?.answer || '',
            notes: response.data[0]?.pageData[index]?.notes || '',
            weights: response.data[0]?.pageData[index]?.weights || '',
            managerEvaluation:
              response.data[0]?.pageData[index]?.managerEvaluation || 0
          })),
          managerScore:response.data[0]?.managerScore ||0
        };
        setFormData([initialFormData]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appraisal details:', error);
        setError('Error fetching appraisal details');
        setLoading(false);
      }
    };

    fetchAppraisalDetails();
  }, [employeeId, timePeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 w-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 w-full flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!formData || !formData[0]) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 w-full flex items-center justify-center">
        <div className="text-lg">No data available</div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-blue-50 p-4 w-full ">
      <div className="mt-14">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Employee Self Appraisal</h1>
            {formData ? (

              <div className="flex items-center gap-2">
                <span className="text-sm bg-white text-cyan-800  px-3 py-2 font-medium rounded">
                  {new Date(formData[0].timePeriod[0]).toISOString().slice(0, 10)} to {new Date(formData[0].timePeriod[1]).toISOString().slice(0, 10)}
                </span>
              </div>
            ) : (<div />)}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {formData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4 ">
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{formData[0].empName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{formData[0].designation}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{formData[0].managerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Self Appraisal Evaluation</p>
                <p className="font-medium text-gray-900">{formData[0].managerScore}</p>
              </div>
            </div>
          </div>) : (<div />)}
      </div>
      <div className="space-y-4 mx-2 rounded-lg ">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center mb-4 border-b ">
            <Award className="text-cyan-700 mr-2" />
            <h2 className="text-xl font-semibold text-cyan-800 my-2 mt-3 pb-2 flex items-center gap-2">
              Self Appraisal & Competencies
            </h2>
          </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                <tr className="bg-gray-50">
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Areas of Self Assessment</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Requirement</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Response</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Notes</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Attainment</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Manager Evaluation
                </th>
               </tr>
              </thead>
              <tbody>
                {questionsAndAnswersEmployee.map((item, index) => {
                  const previousAnswer = formData ? formData[0].pageData[index]?.answer : null;
                  const notes = formData ? formData[0].pageData[index]?.notes : null;
                  const weights = formData ? formData[0].pageData[index]?.weights : null;

                  return (
                 <tr key={index} className="hover:bg-gray-50 transition-colors duration-200 group border-b" >    
                  <td className="p-2 text-sm font-medium text-gray-500 ">{item.question}</td>
                    <td className="p-2 text-sm font-medium text-gray-700 group-hover:text-cyan-800">
                       <span className="bg-blue-50 text-cyan-700 px-2 py-1 rounded w-72">{item.answer}</span>
                    </td>
                    {previousAnswer ? (
                      <td className="p-2 text-sm text-gray-700 w-52">
                        <div className="flex items-center gap-2 mb-1 bg-gray-100 p-1 rounded">
                          <img src={tick} size={14} className="text-gray-400" />
                           <span className="bg-blue-50 text-cyan-700 px-2.5 py-1.5 rounded-lg text-sm font-semibold">
                            {previousAnswer}</span>
                         </div>
                        </td>
                      ) : (
                        <td className="p-2 text-sm text-gray-700">
                          <span className="text-gray-600">No answer available</span>
                        </td>
                      )}
                      {notes ? (
                        <td className="p-2 text-sm text-gray-700 w-48">
                          <span className="text-gray-600">{notes}</span>
                        </td>
                      ) : (<td className="p-2 text-sm text-gray-700">
                        <span className="text-gray-600">No notes to display</span>
                      </td>
                      )}
                      {weights ? (
                        <td className="p-2 text-sm text-left text-gray-700 w-48">
                          <span className="bg-blue-50 text-cyan-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                            {weights} %</span>
                          <span className="bg-blue-50 text-cyan-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                            {weights} %</span>
                        </td>
                      ) : (<td className="p-2 text-sm text-gray-700">
                        <span className="text-gray-600">-</span>
                      </td>
                      )}
                      {/* {status === 'Completed' && ( */}
                      <td className="p-2 text-sm text-gray-600 text-left">
                         {formData[0].pageData[index].managerEvaluation || ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-20 sticky flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
          <div >
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleContinue}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEvaluation;