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
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [attainments, setAttainments] = useState(Array(5).fill(''));
  const [overallScore, setOverallScore] = useState(0);
  const [comments, setComments] = useState(Array(5).fill(''));
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
    const newAttainments = [...attainments];
    newAttainments[index] = event.target.value;
    setAttainments(newAttainments);
  };

  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value;
    setComments(newComments);
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

  const handleContinue = async () => {
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
        navigate("/employee-dashboard");
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    navigate(`/evaluationView3/${employeeId}`, { state: { timePeriod } });
  };



  const handleBack = () => {
    navigate(`/evaluationView1/${employeeId}`, { state: { timePeriod } });
  };
  
  const handleSaveExit = async () => {
    if (!formData || !formData[0] || !formData[0].pageData) return;

    try {
  
      const payload = {
        pageData: formData[0].pageData.map(item => ({
          questionId: item.questionId,
          successMetric: item.successMetric || '',
          notes: item.notes || '',
          weights: item.weights || '',
          managerEvaluation: item.managerEvaluation || 0

        }))
      };
      await axios.put(
        `http://localhost:3003/appraisal/saveAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload })
        }

      );
      console.log("PUT request successful.");



    } catch (error) {
      console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
      setError("Error submitting evaluation");
    }
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
    const score = calculateOverallScore();
    setOverallScore(score);
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
                <p className="font-medium text-gray-900">-</p>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="space-y-4 mx-2 rounded-lg shadow-sm">
        {/* Self Appraisal Section */}

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award size={20} className="text-blue-600" />
            Additional Areas Of Assessment
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">
                    Quality
                  </th>
                  <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">
                    Success & Metric
                  </th>
                  <th className="p-2 border-b border-gray-200 text-center text-sm font-medium text-gray-800">
                    weightage
                  </th>
                  <th className="p-2 border-b border-gray-200 text-center text-sm font-medium text-gray-800">
                    Attainment
                  </th>
                  <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">
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
                    <tr key={index} className="border-b border-gray-200 ">
                      <td className="p-2 text-sm font-medium text-gray-500 ">
                        {item.quality}
                      </td>
                      <td className="p-2 text-sm text-gray-700 w-86">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {item.successMetric}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-700 w-86">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {item.weightage}%
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-600 text-center">
                        <input
                          className="w-20 p-1 border border-gray-300 rounded"
                          value={attainments[index]}
                          onChange={(e) => handleAttainmentChange(index, e)}
                        />
                      </td>

                      <td className="border-l border-r">
                        <textarea
                          className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                          value={comments[index]}
                          onChange={(e) => handleCommentChange(index, e)}
                          rows="2"
                          placeholder="Add your comments..."
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <div className="mt-2 bg-white rounded-lg p-0.5 shadow-md">
    <p className="text-xl font-bold text-blue-600">
    Overall Manager Evaluation Score = {calculateOverallScore()} 
    </p>
  </div>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 bg-white border border-cyan-800 text-cyan-800 rounded-lg"
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
          <div >
            <button
              className="px-6 py-2 text-white bg-cyan-800 rounded-lg"
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