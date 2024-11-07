import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  instructionsList,
  impInstructions,
  goalsResponse,
} from "./appraisalQuestions";
import Intro2 from "../Tabs/Intro2";
import SelfAppraisal2 from "../Tabs/SelfAppraisal2";

const TABS = ["Introduction", "Self Appraisal"];

const M_Form = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [weights, setWeights] = useState(Array(14).fill(0));
  const [notes, setNotes] = useState(Array(14).fill(""));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selfAppraisalPage, setSelfAppraisalPage] = useState(0);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [goalAnswers, setGoalAnswers] = useState(
    goalsResponse.map(() => ({ answer: "" }))
  );

  const location = useLocation();
  const { timePeriod } = location.state || {};
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchuserDetails();
  }, []);

  const fetchuserDetails = async () => {
    const employeeId = localStorage.getItem("employeeId");
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/all/details/${employeeId}`
        );
        // setUserDetails(response.data.user);
        setEmail(response.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };



  const updateWeight = (indexOrArray, value) => {
    if (Array.isArray(indexOrArray)) {
      setWeights(indexOrArray);
    } else {
      const newWeights = [...weights];
      newWeights[indexOrArray] = value;
      setWeights(newWeights);
    }
    console.log("updating weights", weights);
  };

  const saveNotes = (indexOrArray, value) => {
    if (Array.isArray(indexOrArray)) {
      setNotes(indexOrArray);
    } else {
      const newNotes = [...notes];
      newNotes[indexOrArray] = value;
      setNotes(newNotes);
    }
  };

  const handleGoalChange = (index, value) => {
    const updatedAnswers = [...goalAnswers];
    updatedAnswers[index].answer = value;
    setGoalAnswers(updatedAnswers);
  };


  const handleContinue = () => {
    if (activeTab === 1 && selfAppraisalPage === 0) {
      setSelfAppraisalPage(1);
    } else if (activeTab < TABS.length - 1) {
      setSelfAppraisalPage(0);
      // setCompletedSteps(Math.max(completedSteps, activeTab + 1));
      setActiveTab(activeTab + 1);
    }
  };

  const handleSave = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const updatedPageData = {
        ...pageData,
        weights: weights,
        notes: notes
      };
      const response = await fetch(`http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}?isExit=true`, {
        method: 'PUT',
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ updatedPageData }),
        status: "In Progress"
      })


      if (response.ok) {
        console.log('response', response);
        const data = await response.json();
        console.log("data", data);
        navigate("/manager-dashboard");

      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.error}`);

      }
    }

    catch {
      if (activeTab === 1) {
        setSelfAppraisalPage(1);
      }
    }
  }

  const handlePreviousForm = () => {
    if (selfAppraisalPage > 0) {
      setSelfAppraisalPage(selfAppraisalPage - 1);
    } else if (activeTab > 0) {

      setActiveTab(activeTab - 1);
    } else if (activeTab === 0) {
      navigate("/manager-dashboard");
    }
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
      notes: notes[0]
    },

    {
      questionId: 2,
      question: "Team-work:I work effectively and efficiently with team.",

      answer: getAnswerFromWeight(weights[1]),
      notes: notes[1]
    },
    {
      questionId: 3,
      question: "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
      answer: getAnswerFromWeight(weights[2]),
      notes: notes[2]
    },

    // Competency Questions
    {
      questionId: 4,
      question: "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
      answer: getAnswerFromWeight(weights[3]),
      notes: notes[3]
    },
    {
      questionId: 5,
      question: "Leadership: I like to take responsibility in managing the team.",

      answer: getAnswerFromWeight(weights[4]),
      notes: notes[4]
    },
    {
      questionId: 6,
      question: "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
      answer: getAnswerFromWeight(weights[5]),
      notes: notes[5]
    },
    {
      questionId: 7,
      question: "Communication: I convey my thoughts clearly and respectfully.",
      answer: getAnswerFromWeight(weights[6]),
      notes: notes[6]
    },
    {
      questionId: 8,
      question: "Time Management: I complete my tasks on time.",
      answer: getAnswerFromWeight(weights[7]),
      notes: notes[7]
    },
    {
      questionId: 9,
      question: "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
      answer: getAnswerFromWeight(weights[8]),
      notes: notes[8]
    },
    {
      questionId: 10,
      question: "Creativity: I look for solutions outside the work.",
      answer: getAnswerFromWeight(weights[9]),
      notes: notes[9]
    },
    {
      questionId: 11,
      question: "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
      answer: getAnswerFromWeight(weights[10]),
      notes: notes[10]
    },
    {
      questionId: 12,
      question: "Client Interaction: I take the initiative to help shape events that will lead to the organization’s success and showcase it to clients.",

      answer: getAnswerFromWeight(weights[11]),
      notes: notes[11]
    },
    {
      questionId: 13,
      question: "Software Development: I am committed to improving my knowledge and skills.",
      answer: getAnswerFromWeight(weights[12]),
      notes: notes[12]
    },
    {
      questionId: 14,
      question: "Growth: I am proactive in identifying areas for self-development.",
      answer: getAnswerFromWeight(weights[13]),
      notes: notes[13]
    },
    ...goalsResponse.map((goal, index) => ({
      questionId: goal.questionId,
      question: goal.question,
      answer: goalAnswers[index]?.answer || "No Response",
      notes: notes[index + 13],
    })),

  ];


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
        body: JSON.stringify({ pageData })
      })


      if (response.ok) {
        console.log('response', response);

        const data = await response.json();

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
      setIsModalOpen(true);
    }
  }
  const closeModal = () => setIsModalOpen(false);
  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    navigate("/manager-dashboard");
  };

  return (
    <div className="flex h-auto max-w-full  mt-4">
      <div className="border p-4 w-full rounded shadow-lg ">

        {activeTab === 0 && (
          <Intro2
            handlePreviousForm={handlePreviousForm}
            handleContinue={handleContinue}
            instructionsList={instructionsList}
            impInstructions={impInstructions}
          />
        )}
        {activeTab === 1 && (
          <SelfAppraisal2
            selfAppraisalPage={selfAppraisalPage}
            weights={weights}
            notes={notes}
            updateWeight={updateWeight}
            saveNotes={saveNotes}
            handlePreviousForm={handlePreviousForm}
            handleSave={handleSave}
            handleSubmit={() => setIsModalOpen(true)}

          />
        )}


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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="my-3 text-gray-600 text-center">
              Thank you for your submission!</p>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-3/4"
                onClick={closeThankYouModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_Form;