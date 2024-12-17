import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const SelfAppraisalTab = ({
  handlePreviousForm,
}) => {

  const generalQuestions = [
    "Job-Specific Knowledge: I possess and apply the expertise, experience, and background to achieve solid results.",
    "Team-work: I work effectively and efficiently with team.",
    "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
  ];

  const competencyQuestions = [
    "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
    "Leadership: I like to take responsibility in managing the team.",
    "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
    "Communication: I convey my thoughts clearly and respectfully.",
    "Time Management: I complete my tasks on time.",
    "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
    "Creativity: I look for solutions outside the work.",
    "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
    "Client Interaction: I take the initiative to help shape events that will lead to the organization’s success and showcase it to clients.",
    "Software Development: I am committed to improving my knowledge and skills.",
    "Growth: I am proactive in identifying areas for self-development.",
  ];
  const getAttainmentColor = (weight) => {
    if (weight >= 80) return 'bg-orange-100 text-orange-800';
    if (weight >= 60) return 'bg-blue-100 text-blue-800';
    if (weight >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  const getAttainmentText = (weight) => {
    if (weight == 100) return '100%';
    if (weight >= 80) return '80%';
    if (weight >= 60) return '60%';
    if (weight >= 40) return '40%';
    if (weight >= 20) return '20%';
    return '0 %';
  };
  
  const [formData, setFormData] = useState(null);
  const [appraisalDetails, setAppraisalDetails] = useState(null);
  const employeeId = localStorage.getItem('employeeId');
  const [weights, setWeights] = useState({});
  const [notes, setNotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [totalWeight, setTotalWeight] = useState(0);
  const [convertedScore, setConvertedScore] = useState(0);

  const location = useLocation();
  const { timePeriod } = location.state || {}
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  useEffect(() => {
    const appraisalDetails = async () => {
      if (employeeId) {
        try {
          const response = await axios.get(`http://localhost:3003/all/details/${employeeId}`);
          setFormData(response.data);
          setEmail(response.data.user.email);
          console.log("formdata", response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        console.log('User ID not found in local storage.');
      }
    };
    appraisalDetails()
  }, [])

    
  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      if (!employeeId || !timePeriod) {
        setError('Employee ID or time period not found');
        return;
      }
      const questionsAndAnswers = [...generalQuestions, ...competencyQuestions];

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
          }))
          
        };
        console.log("res check for eval", initialFormData);

        setAppraisalDetails([initialFormData]);
        if (initialFormData?.pageData) {
          const initialWeights = {};
          const initialNotes = {};
          
          initialFormData.pageData.forEach((item, index) => {
            initialWeights[index] = parseInt(item.weights) || 0;
            initialNotes[index] = item.notes || '';
          });

          setWeights(initialWeights);
          setNotes(initialNotes);
        }
      } catch (error) {
        console.error('Error fetching appraisal details:', error);
    
      }
    };

    fetchAppraisalDetails();
  }, [employeeId, timePeriod]);

  const updateWeight = (index, value) => {
    setWeights((prev) => {
      const updatedWeights = { ...prev, [index]: value };
      calculateScore(updatedWeights); 
      return updatedWeights;
    });
  };

  const saveNotes = (index, value) => {
    setNotes(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const calculateScore = (updatedWeights) => {
    const totalQuestions = generalQuestions.length + competencyQuestions.length;
    const totalWeight = Object.values(updatedWeights).reduce(
      (sum, weight) => sum + weight,0);

    const score = totalQuestions > 0 ? (totalWeight / (totalQuestions * 100)) * 10 : 0;

    setTotalWeight(totalWeight);
    setConvertedScore(score.toFixed(2)); 
  };

  useEffect(() => {
    calculateScore(weights); 
  }, [weights]);


  const isFormComplete = () => {
    return Object.values(weights).every(weight => weight > 0);
  };
  
 const getAnswerFromWeight = (weight) => {
  switch (weight) {
    case 20:
      return "Strongly Disagree";
    case 40:
      return "Somewhat Disagree";
    case 60:
      return "Agree";
    case 80:
      return "Somewhat Agree";
    case 100:
      return "Strongly Agree";
    default:
      return "No Response";
  }
};

const pageData = [
  {
    questionId: 1,
    question: "Job-Specific Knowledge: I possess and apply the expertise, experience, and background to achieve solid results.",
    answer: getAnswerFromWeight(weights[0]),
    notes: notes[0],
    weights: weights[0]
  },

  {
    questionId: 2,
    question: "Team-work:I work effectively and efficiently with team.",

    answer: getAnswerFromWeight(weights[1]),
    notes: notes[1],
    weights: weights[1]
  },
  {
    questionId: 3,
    question: "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
    answer: getAnswerFromWeight(weights[2]),
    notes: notes[2],
    weights: weights[2]
  },

  // Competency Questions
  {
    questionId: 4,
    question: "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
    answer: getAnswerFromWeight(weights[3]),
    notes: notes[3],
    weights: weights[3]
  },
  {
    questionId: 5,
    question: "Leadership: I like to take responsibility in managing the team.",

    answer: getAnswerFromWeight(weights[4]),
    notes: notes[4],
    weights: weights[4]
  },
  {
    questionId: 6,
    question: "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
    answer: getAnswerFromWeight(weights[5]),
    notes: notes[5],
    weights: weights[5]
  },
  {
    questionId: 7,
    question: "Communication: I convey my thoughts clearly and respectfully.",
    answer: getAnswerFromWeight(weights[6]),
    notes: notes[6],
    weights: weights[6]
  },
  {
    questionId: 8,
    question: "Time Management: I complete my tasks on time.",
    answer: getAnswerFromWeight(weights[7]),
    notes: notes[7],
    weights: weights[7]
  },
  {
    questionId: 9,
    question: "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
    answer: getAnswerFromWeight(weights[8]),
    notes: notes[8],
    weights: weights[8]
  },
  {
    questionId: 10,
    question: "Creativity: I look for solutions outside the work.",
    answer: getAnswerFromWeight(weights[9]),
    notes: notes[9],
    weights: weights[9]
  },
  {
    questionId: 11,
    question: "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
    answer: getAnswerFromWeight(weights[10]),
    notes: notes[10],
    weights: weights[10]
  },
  {
    questionId: 12,
    question: "Client Interaction: I take the initiative to help shape events that will lead to the organization’s success and showcase it to clients.",
    answer: getAnswerFromWeight(weights[11]),
    notes: notes[11],
    weights: weights[11]
  },
  {
    questionId: 13,
    question: "Software Development: I am committed to improving my knowledge and skills.",
    answer: getAnswerFromWeight(weights[12]),
    notes: notes[12],
    weights: weights[12]
  },
  {
    questionId: 14,
    question: "Growth: I am proactive in identifying areas for self-development.",
    answer: getAnswerFromWeight(weights[13]),
    notes: notes[13],
    weights: weights[13]
  },
];


const handleSave = async () => {
  try {
    const employeeId = localStorage.getItem('employeeId');

    const response = await fetch(`http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`, {
      method: 'PUT',
      headers: {
        "content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ pageData,selfScore:convertedScore },),
      status: "In Progress"
    })
    if (response.ok) {
      console.log('response', response);
      const data = await response.json();
      console.log("data", data);
      navigate("/employee-dashboard");
    } else {
      const errorData = await response.json();
      console.log(`Error: ${errorData.error}`);
    }
  }
  catch {
   
  }
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
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ pageData }),
      status: "Submitted"
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
    <div className="mb-10  flex flex-col overflow-y-auto  scrollbar-thin">
         <div className="bg-blue-600 text-white mb-3 p-4 rounded-lg  shadow-lg mt-10 ">
        <h1 className="text-2xl font-bold ">Annual Performance Self-Assessment</h1>
      </div>
      <div className="mb-6">
        {formData ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4   ">

            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">{formData.user.empName}</p>
              </div>
            </div>


            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">{formData.user.designation}</p>
              </div>
            </div>


            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">{formData.user.managerName}</p>
              </div>
            </div>


            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1"> Evaluation Status</p>
                <p className="font-medium text-gray-900">{convertedScore}</p>
              </div>
            </div>
          </div>) : (<div />)}
      </div>

      <div className="mb-6">
      <div className="p-1">
        <h2 className="text-xl font-semibold mb-6">Performance Assessment</h2>

          <table className="w-full border-collapse">
          <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                <td className="p-3 rounded-tl-lg font-medium w-1/3">Assessment Areas</td>
                <td className="p-3 text-center">Strongly Disagree</td>
                <td className="p-3 text-center">Somewhat Disagree</td>
                <td className="p-3 text-center w-32">Agree</td>
                <td className="p-3 text-center">Somewhat Agree</td>
                <td className="p-3 text-center">Strongly Agree</td>
                <td className="p-3 text-center w-52">Notes & Comments</td>
                <td className="p-3 rounded-tr-lg text-center">Attainment</td>
              </tr>
            </thead>
            <tbody>
              {/* Render general questions */}
              {generalQuestions.map((text, index) => (
                <tr key={`general-${index}`} className="border-b hover:bg-gray-50  ">
                  <td className="p-4 border-l">{text}</td>
                  {[20, 40, 60, 80, 100].map((value) => (
                    <td key={value} className="text-center border-l">
                      <input
                        type="radio"
                        name={`feedback-general-${index}`}
                        onChange={() => updateWeight(index, value)}
                        checked={weights[index] === value}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="border-l text-center">
                  <textarea
                      className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={notes[index] || ""}
                      onChange={(e) => saveNotes(index, e.target.value)}
                      rows="2"
                      placeholder="Add your comments..."
                    ></textarea>
                  </td>
                  <td className="border-l  border-r text-center ">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium  ${getAttainmentColor(weights[index])}`}>
                      {getAttainmentText(weights[index])}
                    </span>

                    {/* {weights[index]} */}
                  </td>
                </tr>
              ))}

              {/* Render Competency Section Header */}
              <tr>
                <td colSpan="8" className="bg-gradient-to-r from-blue-100 to-orange-100 p-4 font-semibold text-lg">
                  Competencies
                </td>
              </tr>

              {/* Render competency questions */}
              {competencyQuestions.map((text, index) => (
                <tr key={`competency-${index}`} className="border-b hover:bg-gray-50">
                <td className="p-4 border-l">{text}</td>
                {[20, 40, 60, 80, 100].map((value) => (
                    <td key={value} className="text-center border-l">
                      <input
                        type="radio"
                        name={`feedback-competency-${index}`}
                        onChange={() =>
                          updateWeight(generalQuestions.length + index, value)
                        }
                        checked={weights[generalQuestions.length + index] === value}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"

                      />
                    </td>
                  ))}
                  <td className="border-l border-r">
                  <textarea
                      className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                      value={notes[generalQuestions.length + index] || ""}
                      onChange={(e) =>
                        saveNotes(generalQuestions.length + index, e.target.value)
                      }
                      rows="2"
                      placeholder="Add your comments..."
                    ></textarea>
                  </td>
                  <td className="border-l border-r text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttainmentColor(weights[generalQuestions.length + index])}`}>
                      {getAttainmentText(weights[generalQuestions.length + index])}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-between space-x-4 border-t px-6 py-4">
        <button
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          onClick={handlePreviousForm}
        >
          Back
        </button>
        <div className="flex space-x-4">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            onClick={handleSave}
          >
            <span>Save & Exit</span>
          </button>
          <button
            className={`px-6 py-2 rounded-lg transition-colors
              ${isFormComplete() ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-300 text-white cursor-not-allowed'
             }`}
            onClick={() => setIsModalOpen(true)}
           disabled={!isFormComplete()}
          >
            Submit
          </button>
        </div>
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

export default SelfAppraisalTab;