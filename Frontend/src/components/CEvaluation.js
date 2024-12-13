import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';
import tick from '../assets/tick.svg'
import { useLocation, useParams, useNavigate, json } from 'react-router-dom';

const CEvaluation = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [email, setEmail] = useState(""); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const currentYear = new Date().getFullYear() + 1;
  const token = localStorage.getItem('token')
  const location = useLocation();
  const { timePeriod } = location.state || {}

  // Static questions and answers
  const questionsAndAnswers = [
    { question: 'Job-Specific Knowledge', answer: 'I possess and apply the expertise, experience, and background to achieve solid results.' },
    { question: 'Team Work', answer: 'I work effectively and efficiently with team.' },
    { question: 'Job-Specific Skills', answer: 'I demonstrate the aptitude and competence to carry out my job responsibilities.' },
    { question: 'Adaptability', answer: 'I am flexible and receptive regarding new ideas and approaches.' },
    { question: 'Leadership', answer: 'I like to take responsibility in managing the team.' },
    { question: 'Collaboration', answer: 'I cultivate positive relationships. I am willing to learn from others.' },
    { question: 'Communication', answer: 'I convey my thoughts clearly and respectfully.' },
    { question: 'Time Management', answer: 'I complete my tasks on time. ' },
    { question: 'Results', answer: ' I identify goals that are aligned with the organizations strategic direction and achieve results accordingly.' },
    { question: 'Creativity', answer: 'I look for solutions outside the work.' },
    { question: 'Initiative', answer: 'I anticipate needs, solve problems, and take action, all without explicit instructions.' },
    { question: 'Client Interaction', answer: 'I take the initiative to help shape events that will lead to the organizations success and showcase it to clients.' },
    { question: 'Software Development', answer: 'I am committed to improving my knowledge and skills.' },
    { question: 'Growth', answer: 'I am proactive in identifying areas for self-development.' },
  ];
  const toggleHelpPopup = () => {
    setShowHelpPopup(!showHelpPopup);
  };

  useEffect(() => {
    fetchuserDetails();
  }, []);

  const fetchuserDetails = async () => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/all/details/${employeeId}`
        );

        setEmail(response.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };

  const handleBack = () => {
    setIsModalVisible(false);
    navigate("/manager-performance");
  };

  const handleContinue =  async () => {
    // if (!formData || !formData[0] || !formData[0].pageData) return;
  
    // try {
    //   const overallScore = calculateOverallScore();
    //   const submissionData = {
    //     pageData: formData[0].pageData.map(item => ({
    //       questionId: item.questionId,
    //       answer: item.answer || '',
    //       notes: item.notes || '',
    //       weights: item.weights || '',
    //       managerEvaluation: item.managerEvaluation|| 0
          
    //     })),
    //     overallScore: parseFloat(overallScore),
    //   };
      
  
    // //   await axios.put(
    // //     `http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`,
    // //     submissionData,
    // //     { headers: { "Content-Type": "application/json" } }
    // //   );
    //   console.log("PUT request successful.");
  
     
    // } catch (error) {
    //   console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
    //   setError("Error submitting evaluation");
    // }
  
  
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

        // Initialize the form data with the structure you need
        const initialFormData = {
          empName: response.data[0]?.empName || '',
          designation: response.data[0]?.designation || '',
          managerName: response.data[0]?.managerName || '',
          timePeriod: response.data[0]?.timePeriod || timePeriod,
          status: response.data[0]?.status || '',
          pageData: questionsAndAnswers.map((qa, index) => ({
            questionId: (index + 1).toString(),
            answer: response.data[0]?.pageData[index]?.answer || '',
            notes: response.data[0]?.pageData[index]?.notes || '',
            weights: response.data[0]?.pageData[index]?.weights || '',
            managerEvaluation:
              response.data[0]?.pageData[index]?.managerEvaluation || 0
          }))
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

  const handleManagerEvaluationChange = (e, index) => {
    if (!formData || !formData[0]) return;

    const updatedFormData = [...formData];
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);

    if (!updatedFormData[0].pageData[index].managerEvaluation) {
      updatedFormData[0].pageData[index].managerEvaluation = {};
    }

    updatedFormData[0].pageData[index].managerEvaluation = value;
    setFormData(updatedFormData);
  };



  // const handleSaveExit = async () => {
  //   try {
     
  //     const submissionData = {
  //       pageData: formData[0].pageData.map(item => ({
  //         questionId: item.questionId,
  //         answer: item.answer || '',
  //         notes: item.notes || '',
  //         weights: item.weights || '',
  //         managerEvaluation: item.managerEvaluation|| 0
          
  //       }))
  //     };
      
  
  //   //   await axios.put(
  //   //     `http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`,
  //   //     submissionData,
  //   //     { headers: { "Content-Type": "application/json" } }
  //   //   );
  //     console.log("PUT request successful.");
  
     
  //   } catch (error) {
  //     console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
  //     setError("Error submitting evaluation");
  //   }
  
  
  //   navigate('/manager-performance'); 
   
    
  // };


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

  const calculateOverallScore = () => {
    if (!formData || !formData[0] || !formData[0].pageData) return 0;
  
    const totalQuestions = formData[0].pageData.length;
    const totalPercentage = totalQuestions * 100;
  
    const totalManagerEvaluation = formData[0].pageData.reduce((sum, item) => {
      return sum + (item.managerEvaluation || 0); 
    }, 0);
  
    const overallScore = (totalManagerEvaluation / totalPercentage) * 10; 
    return overallScore.toFixed(2); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full ">
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Employee Self Appraisal</h1>
            {formData ? (

              <div className="flex items-center gap-2">
                <span className="text-sm bg-blue-50 text-cyan-800  px-3 py-2 font-medium rounded">
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
            {/* Employee Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{formData[0].empName}</p>
              </div>
            </div>

            {/* Designation Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{formData[0].designation}</p>
              </div>
            </div>

            {/* Manager Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{formData[0].managerName}</p>
              </div>
            </div>

            {/* Evaluation Status Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Self Appraisal Evaluation</p>
                <p className="font-medium text-gray-900">{calculateOverallScore()}</p>
              </div>
            </div>
          </div>) : (<div />)}
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="space-y-4 mx-2 rounded-lg ">
        {/* Self Appraisal Section */}

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-cyan-800 border-b mb-6  pb-2 flex items-center gap-2">
            Self Appraisal & Competencies
          </h2>
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
            Manager Evaluation</th>
                  
                </tr>
              </thead>
              <tbody>
                {questionsAndAnswers.map((item, index) => {
                  const previousAnswer = formData ? formData[0].pageData[index]?.answer : null;
                  const notes = formData ? formData[0].pageData[index]?.notes : null;
                  const weights = formData ? formData[0].pageData[index]?.weights : null;

                  return (
                    <tr 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors duration-200 group border-b"
                  >                      <td className="p-2 text-sm font-medium text-gray-500 ">{item.question}</td>
              <td className="p-2 text-sm font-medium text-gray-700 group-hover:text-cyan-800">
                        <span className="bg-blue-50 text-cyan-700 px-2 py-1 rounded">{item.answer}</span>
                      </td>
                      {previousAnswer ? (
                        <td className="p-2 text-sm text-gray-700 w-48">
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
                        <td className="p-2 text-sm text-center text-gray-700 w-48">
                                       <span className="bg-blue-50 text-cyan-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                                       {weights} %</span>
                        </td>
                      ) : (<td className="p-2 text-sm text-gray-700">
                        <span className="text-gray-600">-</span>
                      </td>
                      )}
                      {/* {status === 'Completed' && ( */}
                      <td className="p-2 text-sm text-gray-600 text-center">
                       
                         {formData[0].pageData[index].managerEvaluation || ''}
                          
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <div className="mt-2 bg-white rounded-lg p-0.5 shadow-md">
   
  </div>
            </table>
          </div>
        </div>

        <div className="mt-20 sticky flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 bg-white border border-cyan-800 text-cyan-800 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
          {/* <div  className='mr-2'>
            <button
              className="px-6 py-2 text-white bg-orange-500 rounded-lg"
              onClick={handleSaveExit}
            >
             Save & Exit
            </button>
          </div> */}
          <div >
            <button
              className="px-6 py-2 text-white bg-cyan-800 rounded-lg"
              onClick={handleContinue}
            >
              Next
            </button>
          </div>  
        </div>

        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
              <div className="p-6">
                <p className="mt-3 text-gray-600 text-center">
                  Thank you for submitting
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={() => handleBack()}
                  >
                    back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CEvaluation;