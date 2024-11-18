import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Weight,
} from "lucide-react";
import tick from "../../assets/tick.svg";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const EvaluationView2 = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const currentYear = new Date().getFullYear() + 1;
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [currentNotes, setCurrentNotes] = useState({});

  // Static questions and answers
  const questionsAndAnswers = [
    {
      question: "Setting Expectations",
      answer:
        "Setting Expectations ensures clarity on goals, responsibilities, and standards for effective team collaboration.",
        Weight:"5%",
    },
    {
      question: "Promoting Best Use of Capabilities",
      answer: "Encouraging effective utilization of skills and tools to achieve optimal performance and desired outcomes.",
      Weight:"5%",
    },
    {
      question: "Information Sharing",
      answer:
        "Facilitating seamless exchange of knowledge and updates to enhance collaboration and decision-making processes.",
        Weight:"5%",
    },
    {
      question: "Promoting Team Culture",
      answer: "Promoting team culture involves fostering collaboration, communication, trust, and mutual respect to achieve shared goals.",
      Weight:"5%",
    },
    {
      question: "Leading with Dignity and Respect",
      answer: "Leading with dignity and respect means treating others with fairness, kindness, and valuing their contributions.",
      Weight:"5%",
    },
    {
      question: "Fostering Innovation",
      answer:
        "Fostering innovation involves encouraging creativity, collaboration, and risk-taking to develop new solutions and ideas.",
        Weight:"5%",
    },
    {
      question: "Demonstrating Confidence",
      answer: "Demonstrating confidence means expressing belief in one's abilities, decisions, and actions with clarity and assurance.",
      Weight:"5%",
    },
    { question: "Driving Initiative", answer: "Driving initiative refers to proactively leading projects, fostering innovation, and taking ownership of outcomes.", Weight:"5%",},
    {
      question: "Completing Projects",
      answer:
        " Managing and delivering projects on time, ensuring quality, and meeting client expectations and requirements.",
        Weight:"5%",
    },
    {
      question: "Meeting Deadlines",
      answer: "Meeting deadlines means completing tasks on time, ensuring project progress and maintaining team efficiency.",
      Weight:"5%",
    },
    {
      question: "Communicating Expectations",
      answer:
        "Clearly outlining objectives, responsibilities, and timelines to ensure team alignment and successful outcomes.",
        Weight:"5%",
    },
    {
      question: "Communicating Feedback",
      answer:
        "Providing constructive feedback to help employees understand their performance and grow.",
        Weight:"5%",
    },
    {
      question: "Developing Talent",
      answer: "Developing talent focuses on identifying, nurturing, and enhancing employees' skills for future leadership roles.",
      Weight:"5%",
    },
    {
      question: "Following Best Hiring Practices",
      answer: "Could you clarify which specific hiring practices question you're referring to, so I can help?",
      Weight:"5%",
    },
    {
      question: "Setting Goals",
      answer: "Setting goals involves defining clear, measurable objectives for employees to track progress and performance.",
      Weight:"5%",
    },
    {
      question: "Efficiency",
      answer: "Efficiency refers to achieving maximum productivity with minimal wasted effort or resources in processes.",
      Weight:"5%",
    },
    {
      question: "Recovering from Setbacks",
      answer: "Recovering from setbacks involves learning from mistakes, staying resilient, and adapting to challenges effectively.",
      Weight:"5%",
    },
    {
      question: "Demonstrating Ability to Teach",
      answer: "Demonstrating the ability to teach involves explaining concepts clearly, engaging others, and fostering understanding.",
      Weight:"5%",
    },
    {
      question: "Demonstrating Ability to Learn",
      answer: "Demonstrating ability to learn involves quickly adapting, acquiring new skills, and applying knowledge effectively.",
      Weight:"5%",
    },
    {
      question: "Promoting the Brand and Best Business Practices",
      answer: "Promoting the brand and best business practices involves fostering trust, innovation, and ethical leadership consistently.",
      Weight:"5%",
    },
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

//   const handleBack = () => {
//     setIsModalVisible(false);
//     navigate("/manager-dashboard");
//   };

  const handleFormBack = () => {
    navigate(`/evaluationView1/${employeeId}`, { state: { timePeriod } });
  };

  const handleContinue = () => {
    navigate(`/evaluationSummary/${employeeId}`, { state: { timePeriod } });
  };


  useEffect(() => {
    const fetchAppraisalDetails = async () => {
      console.log(employeeId);
      if (!employeeId || !timePeriod) {
        setError("Employee ID or time period not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          ` http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );

        // Initialize the form data with the structure you need
        const initialFormData = {
          empName: response.data[0]?.empName || "",
          designation: response.data[0]?.designation || "",
          managerName: response.data[0]?.managerName || "",
          timePeriod: response.data[0]?.timePeriod || timePeriod,
          status: response.data[0]?.status || "",
          pageData: questionsAndAnswers.map((qa, index) => ({
            questionId: (index + 1).toString(),
            answer: response.data[0]?.pageData[index]?.answer || "",
            notes: response.data[0]?.pageData[index]?.notes || "",
            weights: response.data[0]?.pageData[index]?.weights || "",
            managerEvaluation:
              response.data[0]?.pageData[index]?.managerEvaluation || 0,
          })),
        };

        setFormData([initialFormData]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appraisal details:", error);
        setError("Error fetching appraisal details");
        setLoading(false);
      }
    };

    fetchAppraisalDetails();
  }, [employeeId, timePeriod]);

  const handleManagerEvaluationChange = (e, index) => {
    if (!formData || !formData[0]) return;

    const updatedFormData = [...formData];
    const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);

    if (!updatedFormData[0].pageData[index].managerEvaluation) {
      updatedFormData[0].pageData[index].managerEvaluation = {};
    }

    updatedFormData[0].pageData[index].managerEvaluation = value;
    setFormData(updatedFormData);
  };

  const saveNotesAndSave = (index, value) => {
    const updatedNotes = [...currentNotes];
    updatedNotes[index] = value;
    setCurrentNotes(updatedNotes);
    // saveNotes?.(index, value);
  };

//   const handleSubmit = async () => {
//     navigate(/manager-objective/${employeeId}, { state: { timePeriod } });
//   };

const handleBack = () => {
    navigate(`/evaluationView1/${employeeId}`,{state:{timePeriod}});
};
// const handleContinue = () => {
//     navigate(`/manager-performance/${employeeId}`,{state:{timePeriod}}); 
//   }

const handleSaveAndExit = async () => {
    if (!formData || !formData[0] || !formData[0].pageData) return;
  
    try {
      const submissionData = {
        pageData: formData[0].pageData.map(item => ({
          questionId: item.questionId,
          answer: item.answer || '',
          notes: item.notes || '',
          weights: item.weights || '',
          managerEvaluation: item.managerEvaluation || 0
        }))
      };
   
      console.log("Data saved successfully.",employeeId);
      console.log('TimePeriod1',timePeriod[0])
      console.log('TimePeriod1',timePeriod[1])


      await axios.put(
        `http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        submissionData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Data saved successfully.");
      
  
      // Redirect to evaluation view page after saving data
      navigate("/manager-performance");
  
    } catch (error) {
      console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
      setError("Error submitting evaluation");
    }
  };

const handleSubmit = async () => {
    if (!formData || !formData[0] || !formData[0].pageData) return;

    try {
      const email2 = { email }
      console.log("email", email2);

      console.log("Submitting form with employeeId:", employeeId, "and email:", email);

      const submissionData = {
        pageData: formData[0].pageData.map(item => ({
          questionId: item.questionId,
          answer: item.answer || '',
          notes: item.notes || '',
          weights: item.weights || '',
          managerEvaluation: item.managerEvaluation || 0

        }))
      };


      await axios.put(
        `http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        submissionData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("PUT request successful.");

      await axios.post(
        "http://localhost:3003/confirmationEmail/completedEmail",
        { userId: employeeId, email: email },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("POST request for confirmation email successful.");

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
      setError("Error submitting evaluation");
    }
  };

  const status = formData ? formData.status : null;
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
                    Weight
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
                {questionsAndAnswers.map((item, index) => {
                  const previousAnswer = formData
                    ? formData[0].pageData[index]?.answer
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
                        {item.question}
                      </td>
                      <td className="p-2 text-sm text-gray-700 w-86">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {item.answer}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-700 w-86">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {item.Weight}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-600 text-center">
                        <input
                          className="w-20 p-1 border border-gray-300 rounded  "
                          value={
                            formData[0].pageData[index].managerEvaluation || ""
                          }
                          onChange={(e) =>
                            handleManagerEvaluationChange(e, index)
                          }
                        />
                      </td>

                      <td className="border-l border-r">
                        <textarea
                          className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                          value={
                            currentNotes[questionsAndAnswers.length + index] ||
                            ""
                          }
                          onChange={(e) =>
                            saveNotesAndSave(
                              questionsAndAnswers.length + index,
                              e.target.value
                            )
                          }
                          rows="2"
                          placeholder="Add your comments..."
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
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
          <div  className='mr-2'>
            <button
              className="px-6 py-2 text-white bg-orange-500 rounded-lg"
              onClick={handleSubmit}
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