import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  TrendingUp,
  Award,
} from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const EvaluationView2 = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [additionalAreaData, setadditionalAreaData] = useState(null);
  const [additionalAreas, setadditionalAreas] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [attainments, setAttainments] = useState(Array(5).fill(''));
  const [overallScore, setOverallScore] = useState(0);
  const [comments, setComments] = useState(Array(5).fill(''));
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


  useEffect(() => {
    const fetchAdditionalAreas = async () => {
      if (!employeeId || !timePeriod) {
        setError("Employee ID or time period not found");
        return;
      }
  
      try {
        const response = await axios.get(
          `http://localhost:3003/appraisal/getAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );
  
        const areas = response.data.data.areas || [];
        const fetchedAttainments = areas.map((area) => area.attainments || "");
        setAttainments(fetchedAttainments);

        const fetchedcomments = areas.map((area) => area.comments || "");
        setComments(fetchedcomments);
        console.log("Fetched attainments:", fetchedAttainments);
        console.log("Fetched comments:", fetchedcomments);
      } catch (error) {
        console.error("Error fetching appraisal details:", error);
        setError("Error fetching appraisal details");
      }
    };
  
    fetchAdditionalAreas();
  }, [employeeId, timePeriod]);
  

  
  const AdditionalAreas = [
    {
      quality: "Setting Expectations",
      successMetric:
        "Setting Expectations ensures clarity on goals, responsibilities, and standards for effective team collaboration.",
      weightage: 5,

    },
    {
      quality: "Promoting Best Use of Capabilities",
      successMetric: "Encouraging effective utilization of skills and tools to achieve optimal performance and desired outcomes.",
      weightage: 5,

    },
    {
      quality: "Information Sharing",
      successMetric:
        "Facilitating seamless exchange of knowledge and updates to enhance collaboration and decision-making processes.",
      weightage: 5,

    },
    {
      quality: "Promoting Team Culture",
      successMetric: "Promoting team culture involves fostering collaboration, communication, trust, and mutual respect to achieve shared goals.",
      weightage: 5,

    },
    {
      quality: "Leading with Dignity and Respect",
      successMetric: "Leading with dignity and respect means treating others with fairness, kindness, and valuing their contributions.",
      weightage: 5,

    },
    {
      quality: "Fostering Innovation",
      successMetric:
        "Fostering innovation involves encouraging creativity, collaboration, and risk-taking to develop new solutions and ideas.",
      weightage: 5,

    },
    {
      quality: "Demonstrating Confidence",
      successMetric: "Demonstrating confidence means expressing belief in one's abilities, decisions, and actions with clarity and assurance.",
      weightage: 5,

    },
    {
      quality: "Driving Initiative", successMetric: "Driving initiative refers to proactively leading projects, fostering innovation, and taking ownership of outcomes.", weightage: 5,

    },
    {
      quality: "Completing Projects",
      successMetric:
        " Managing and delivering projects on time, ensuring quality, and meeting client expectations and requirements.",
      weightage: 5,

    },
    {
      quality: "Meeting Deadlines",
      successMetric: "Meeting deadlines means completing tasks on time, ensuring project progress and maintaining team efficiency.",
      weightage: 5,

    },
    {
      quality: "Communicating Expectations",
      successMetric:
        "Clearly outlining objectives, responsibilities, and timelines to ensure team alignment and successful outcomes.",
      weightage: 5,

    },
    {
      quality: "Communicating Feedback",
      successMetric:
        "Providing constructive feedback to help employees understand their performance and grow.",
      weightage: 5,

    },
    {
      quality: "Developing Talent",
      successMetric: "Developing talent focuses on identifying, nurturing, and enhancing employees' skills for future leadership roles.",
      weightage: 5,

    },
    {
      quality: "Following Best Hiring Practices",
      successMetric: "Could you clarify which specific hiring practices quality you're referring to, so I can help?",
      weightage: 5,

    },
    {
      quality: "Setting Goals",
      successMetric: "Setting goals involves defining clear, measurable objectives for employees to track progress and performance.",
      weightage: 5,

    },
    {
      quality: "Efficiency",
      successMetric: "Efficiency refers to achieving maximum productivity with minimal wasted effort or resources in processes.",
      weightage: 5,

    },
    {
      quality: "Recovering from Setbacks",
      successMetric: "Recovering from setbacks involves learning from mistakes, staying resilient, and adapting to challenges effectively.",
      weightage: 5,

    },
    {
      quality: "Demonstrating Ability to Teach",
      successMetric: "Demonstrating the ability to teach involves explaining concepts clearly, engaging others, and fostering understanding.",
      weightage: 5,


    },
    {
      quality: "Demonstrating Ability to Learn",
      successMetric: "Demonstrating ability to learn involves quickly adapting, acquiring new skills, and applying knowledge effectively.",
      weightage: 5,


    },
    {
      quality: "Promoting the Brand and Best Business Practices",
      successMetric: "Promoting the brand and best business practices involves fostering trust, innovation, and ethical leadership consistently.",
      weightage: 5,

    },
  ];
  const handleAttainmentChange = (index, event) => {
    const inputValue = event.target.value;
    
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    // Convert to number for validation
    const numValue = numericValue ? parseInt(numericValue, 10) : '';
    
    // Validate the input
    if (numValue === '' || (numValue >= 1 && numValue <= 100)) {
      const newAttainments = [...attainments];
      newAttainments[index] = numValue === '' ? '' : numValue.toString();
      setAttainments(newAttainments);
    }
  };

  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value;
    setComments(newComments);
  };

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

  const isFormComplete = () => {
    return AdditionalAreas.every((area, index) => {
      const attainment = attainments[index];
      
      return attainment !== undefined && 
             attainment !== null && 
             attainment !== '' && 
             !isNaN(parseFloat(attainment)) && 
             parseFloat(attainment) >= 1 && 
             parseFloat(attainment) <= 100;
    });
  };

  const handleContinue = async () => {
    if (!isFormComplete()) {
      alert("Please assign attainments to all additional areas (1-100)");
      return;
    }
    try {
      const payload = AdditionalAreas.map((area, index) => ({
        quality: area.quality,
        successMetric: area.successMetric,
        weightage: area.weightage,
        attainments: attainments[index],
        comments: comments[index]
      }));
      const overallScore = calculateOverallScore();
      const response = await fetch(`http://localhost:3003/appraisal/saveAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`, {
        method: 'PUT',
        headers: {
          "content-Type": "application/json",

        },
        body: JSON.stringify({ payload, overallScore }),

      })
      if (response.ok) {
        console.log('response', response);
        const data = await response.json();
        console.log("data", data);
        
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    navigate(`/evaluationSummary/${employeeId}`, { state: { timePeriod } });
  };



  const handleBack = () => {
    navigate(`/evaluationView1/${employeeId}`, { state: { timePeriod } });
  };
  
  const handleSaveExit = async () => {

    try {
      const payload = AdditionalAreas.map((area, index) => ({
        quality: area.quality,
        successMetric: area.successMetric,
        weightage: area.weightage,
        attainments: attainments[index],
        comments: comments[index]
      }));
      const overallScore = calculateOverallScore();
      const response = await fetch(`http://localhost:3003/appraisal/saveAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`, {
        method: 'PUT',
        headers: {
          "content-Type": "application/json",

        },
        body: JSON.stringify({ payload, overallScore }),

      })
      if (response.ok) {
        console.log('response', response);
        const data = await response.json();
        console.log("data", data);
        
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    // navigate(`/manager-performance`, { state: { timePeriod } });
        const empType = localStorage.getItem('empType')
        if(empType==='Manager') navigate('/manager-performance');
        else if(empType==='HR') navigate('/hr-performance')
  };
 
  const calculateOverallScore = () => {
    if (!attainments || attainments.length === 0) return 0;
  
    const totalQuestions = attainments.length;
    const totalPercentage = totalQuestions * 100;
  
    const totalManagerEvaluation = attainments.reduce((sum, attainment) => {
      return sum + (parseFloat(attainment) || 0);
    }, 0);
  
    const score = (totalManagerEvaluation / totalPercentage) * 25;
    return parseFloat(score.toFixed(2)); 
  };
  
  useEffect(() => {
    if (attainments.length < AdditionalAreas.length) {
      setAttainments((prev) => [
        ...prev,
        ...Array(AdditionalAreas.length - prev.length).fill(""),
      ]);
    }
  }, [attainments]);
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full ">
      <div className="mb-2">
        {/* Header Section */}
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Employee Additional Areas</h1>
            {formData ? (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-blue-50 text-cyan-800  px-3 py-2 font-medium rounded">
                  {new Date(formData[0].timePeriod[0])
                    .toISOString()
                    .slice(0, 10)}{" "}
                  to{" "}
                  {new Date(formData[0].timePeriod[1])
                    .toISOString()
                    .slice(0, 10)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4 ">
            {/* Employee Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                <p className="font-medium text-gray-900">
                  {formData[0].empName}
                </p>
              </div>
            </div>

            {/* Designation Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Designation</p>
                <p className="font-medium text-gray-900">
                  {formData[0].designation}
                </p>
              </div>
            </div>

            {/* Manager Name Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-green-100 rounded-lg shrink-0">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Manager Name</p>
                <p className="font-medium text-gray-900">
                  {formData[0].managerName}
                </p>
              </div>
            </div>

            {/* Evaluation Status Card */}
            <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
              <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Manager's Evaluation
                </p>
                <p className="font-medium text-gray-900">{calculateOverallScore()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="space-y-4 mx-2 rounded-lg ">
        {/* Self Appraisal Section */}

        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-semibold text-cyan-800 mb-6 border-b pb-2 flex items-center gap-2">
    Additional Areas of Assessment
  </h2>
  
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Quality
          </th>
          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Success & Metric
          </th>
          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Weightage
          </th>
          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Attainment
          </th>
          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            Comments
          </th>
        </tr>
      </thead>
      <tbody>
        {AdditionalAreas.map((item, index) => {
          const previousAnswer = formData
            ? formData[0].pageData[index]?.successMetric
            : null;
          const notes = formData
            ? formData[0].pageData[index]?.notes
            : null;
          const weights = formData
            ? formData[0].pageData[index]?.weights
            : null;

          return (
            <tr 
              key={index} 
              className="hover:bg-gray-50 transition-colors duration-200 group border-b"
            >
              <td className="p-2 text-sm font-medium text-gray-700 group-hover:text-cyan-800">
                {item.quality}
              </td>
              <td className="p-2">
                <span className="bg-blue-50 text-cyan-800 px-2.5 py-2 rounded-md text-sm font-semibold">
                  {item.successMetric}
                </span>
              </td>
              <td className="p-2 text-center">
                <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                  {item.weightage}%
                </span>
              </td>
              <td className="p-2 text-center ">
                <input
                  className="w-24 p-2 text-sm border border-gray-300 rounded-md  focus:border-transparent transition-all duration-300 text-center"
                  value={attainments[index]}
                  onChange={(e) => handleAttainmentChange(index, e)}
                  placeholder="0%"
                />
              </td>
              <td className="p-2">
                <textarea
                  className="w-full p-1 mt-1 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={comments[index]}
                  onChange={(e) => handleCommentChange(index, e)}
                  rows="2"
                  placeholder="Add your insights."
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Optional Score Display */}
  {/* <div className="mt-4 bg-gray-50 rounded-lg p-3 flex justify-between items-center">
    <span className="text-sm text-gray-600 font-medium">
      Total Weighted Score
    </span>
    <span className="text-lg font-bold text-blue-600">
      {calculateOverallScore()} %
    </span>
  </div> */}
</div>

        <div className="mt-20 sticky flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 bg-white hover:bg-slate-100 border border-cyan-800 text-cyan-800 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
          <div className='mr-2'>
            <button
              className="px-6 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
              onClick={handleSaveExit}
            >
              Save & Exit
            </button>
          </div>
          <div >
          <button
            className={`px-6 py-2 rounded-lg transition-colors ${isFormComplete() ? 'bg-cyan-800 hover:bg-cyan-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'
              }`}  
                            onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationView2;