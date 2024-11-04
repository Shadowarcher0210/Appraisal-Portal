
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   instructionsList,
//   impInstructions,
//   questionsAndAnswers,
//   goalsResponse,
// } from "./appraisalQuestions";
// import IntroductionTab from "../Tabs/introductionTab";
// import SelfAppraisalTab from "../Tabs/selfAppraisalTab";
// import SelfAppraisal2 from "../Tabs/SelfAppraisal2";

// import GoalsTab from "../Tabs/goalsTab";

// const TABS = ["Introduction", "Self Appraisal", "Goals"];

// const EmpForm = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [weights, setWeights] = useState(Array(15).fill(0));
//   const [notes, setNotes] = useState(Array(15).fill(""));
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selfAppraisalPage, setSelfAppraisalPage] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState(0);
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
//  const [userDetails, setUserDetails] = useState(null);
//  const [submitNotification, setSubmitNotification] = useState(null);


//   const location = useLocation();
//   const { timePeriod } = location.state || {};

//   const updateWeight = (index, percentage) => {
//     const newWeights = [...weights];
//     newWeights[index] = percentage;
//     setWeights(newWeights);
//   };

//   const saveNotes = (index, data) => {
//     const newNotes = [...notes];
//     newNotes[index] = data;
//     setNotes(newNotes);
//   };

//   const handleContinue = () => {
//     if (activeTab === 1 && selfAppraisalPage === 0) {
//       setSelfAppraisalPage(1);
//     } else if (activeTab < TABS.length - 1) {
//       setActiveTab(activeTab + 1);
//       setSelfAppraisalPage(0);
//       setCompletedSteps(Math.max(completedSteps, activeTab + 1));
//     }
//   };
//   const [goalAnswers, setGoalAnswers] = useState(
//     goalsResponse.map(() => ({ answer: '' }))
//   );

//   const handleGoalChange = (index, value) => {
//     const updatedAnswers = [...goalAnswers];
//     updatedAnswers[index].answer = value;
//     setGoalAnswers(updatedAnswers);
//   };


//   const handlePreviousForm = () => {
//     if (selfAppraisalPage > 0) {
//       setSelfAppraisalPage(selfAppraisalPage - 1);
//     } else if (activeTab > 0) {

//       setActiveTab(activeTab - 1);
//     } else if(activeTab === 0){
//       navigate('/employee-dashboard')
//     }
//   };


//   const fetchuserDetails = async () => {
//     const employeeId = localStorage.getItem("employeeId");
//     console.log("Retrieved employeeId:", employeeId);

//     if (employeeId) {
//       try {
//         const response = await axios.get(
//           `http://localhost:3003/all/details/${employeeId}`
//         );
//         setUserDetails(response.data.user);

//         setEmail(response.data.user.email);
//         console.log("email", response.data.user.email);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     } else {
//       console.log("User ID not found in local storage.");
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect called to fetch user details");
//     fetchuserDetails();
//   }, []);

//   const handleSubmit = async () => {
// 		 setIsModalOpen(true);
//   };

//   const getAnswerFromWeight = (weight) => {
//     switch (weight) {
//       case 20:
//         return "Strongly Disagree";
//       case 40:
//         return "Somewhat Disagree";
//       case 60:
//         return "Agree";
//       case 80:
//         return "Somewhat Agree";
//       case 100:
//         return "Strongly Agree";
//       default:
//         return "No Response";
//     }
//   };
//   const HorizontalStepper = ({ steps, activeStep, completedSteps }) => {
//     return (
//       <div className="flex justify-center items-center my-6">
//         {steps.map((step, index) => (
//           <div key={index} className="flex items-center">
//             <div className="flex flex-col items-center">
//             <div
//               className={`flex items-center justify-center h-8 w-8 rounded-full ${
//                 index <= completedSteps ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
//               }`}
//             >
//               {index + 1}
//             </div>
//             <span className="absolute mt-9">
//               {step}
//             </span>
//             </div>
//             {index < steps.length - 1 && (
//               <div
//                 className={`flex-1 border-t-2 mx-2 ${
//                   index < completedSteps ? 'border-blue-500' : 'border-gray-300'
//                 }`}
//                 style={{ width: '300px' }} 
//               ></div>
//             )}
//           </div>
//         ))}

//       </div>
//     );
//   };


//   const handleConfirmSubmit = async () => {
//     setIsModalOpen(false);
//     setIsThankYouModalOpen(true);
//     const employeeId = localStorage.getItem('employeeId');
//     const token = localStorage.getItem('token')
//     if (!token) {
//       console.log("No token found. Please log in.");
//       return;
//     }
//    const pageData = [
//       // General Questions
//       {
//         questionId: 1,
//         question: "Job-Specific Knowledge: I possess and apply the expertise, experience, and background to achieve solid results.",
//         answer: getAnswerFromWeight(weights[0]),
//         notes: notes[0]
//       },
//       {
//         questionId: 2,
//         question: "I work effectively and efficiently.",
//         answer: getAnswerFromWeight(weights[1]),
//         notes: notes[1]
//       },
//       {
//         questionId: 3,
//         question: "Job-Specific Skills: I demonstrate the aptitude and competence to carry out my job responsibilities.",
//         answer: getAnswerFromWeight(weights[2]),
//         notes: notes[2]
//       },

//       // Competency Questions
//       {
//         questionId: 4,
//         question: "Adaptability: I am flexible and receptive regarding new ideas and approaches.",
//         answer: getAnswerFromWeight(weights[3]),
//         notes: notes[3]
//       },
//       {
//         questionId: 5,
//         question: "In response to the fluctuating demands of my job, I adapt easily to plans, goals, actions, and priorities.",
//         answer: getAnswerFromWeight(weights[4]),
//         notes: notes[4]
//       },
//       {
//         questionId: 6,
//         question: "Collaboration: I cultivate positive relationships. I am willing to learn from others.",
//         answer: getAnswerFromWeight(weights[5]),
//         notes: notes[5]
//       },
//       {
//         questionId: 7,
//         question: "Communication: I convey my thoughts clearly and respectfully.",
//         answer: getAnswerFromWeight(weights[6]),
//         notes: notes[6]
//       },
//       {
//         questionId: 8,
//         question: "I demonstrate effective listening skills.",
//         answer: getAnswerFromWeight(weights[7]),
//         notes: notes[7]
//       },
//       {
//         questionId: 9,
//         question: "Results: I identify goals that are aligned with the organization’s strategic direction and achieve results accordingly.",
//         answer: getAnswerFromWeight(weights[8]),
//         notes: notes[8]
//       },
//       {
//         questionId: 10,
//         question: "I persist through significant difficulties to achieve those goals.",
//         answer: getAnswerFromWeight(weights[9]),
//         notes: notes[9]
//       },
//       {
//         questionId: 11,
//         question: "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
//         answer: getAnswerFromWeight(weights[10]),
//         notes: notes[10]
//       },
//       {
//         questionId: 12,
//         question: "I take the initiative to discover new work challenges and to help shape events that will lead to the organization’s success.",
//         answer: getAnswerFromWeight(weights[11]),
//         notes: notes[11]
//       },
//       {
//         questionId: 13,
//         question: "Development: I am committed to improving my knowledge and skills.",
//         answer: getAnswerFromWeight(weights[12]),
//         notes: notes[12]
//       },
//       {
//         questionId: 14,
//         question: "Growth: I am proactive in identifying areas for self-development.",
//         answer: getAnswerFromWeight(weights[13]),
//         notes: notes[13]
//       },
//       ...goalsResponse.map((goal, index) => ({
//         questionId: goal.questionId,
//         question: goal.question,
//         answer: goalAnswers[index].answer,
//         notes: notes[index + 13], // Adjust if needed
//       })),

//     ];

//     try {
//       // await new Promise((resolve) => setTimeout(resolve, 2000));

//       const employeeId = localStorage.getItem('employeeId');
//       const response = await fetch(`http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`, {


//         method: 'PUT',
//         headers: {
//           "content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ pageData })
//       })
//       if (response.ok) {
//         console.log('response', response);

//         const data = await response.json();
//       } else {
//         const errorData = await response.json();
//         console.log(`Error: ${errorData.error}`);
//       }
//       const emailresponse = await fetch(`http://localhost:3003/confirmationEmail/email`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email
//         }),
//       });
//       const emailData = await emailresponse.json();
//       console.log(emailData.message);


//       //submit notif
//       console.log('Fetching submit notification for:', { employeeId });
//       const response2 = await axios.get(`http://localhost:3003/form/getsubmit/${employeeId}`);

//       console.log('API Response:', response2.data);

//       if (response2.data) {
//         setSubmitNotification(response2.data);
//         console.log('response2.data.message', response2.data);

//         localStorage.setItem('submitNotification', response2.data.message);
//         console.log("submitNotification", response2.data.message)
//       } else {
//         console.warn('No message in response:', response2.data);
//       }

//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//     finally {
//       // Optionally reopen the modal or perform any cleanup
//       setIsModalOpen(true);
//     }
//   }



//   const closeModal = () => {
//     setIsModalOpen(false);
//     // navigate('/employee-dashboard');
//   };

//   const closeThankYouModal = () => {
//     setIsThankYouModalOpen(false);
//     navigate("/employee-dashboard");
//   };

//   return (
//     <div className="flex ml-4 mt-16 overflow-hidden "style={{maxHeight: "700px", scrollbarWidth:"thin"}}>
//       <div className="w-48 h-full bg-gray-100 p-4 fixed">
//         <h2 className="text-lg font-bold mb-6">Forms</h2>
//         <ul>
//           {TABS.map((tab, index) => (
//             <li key={index}>
//               <button
//                 className={`w-full text-left px-4 py-2 mb-2 rounded-lg ${
//                   activeTab === index
//                     ? "bg-blue-500 text-white"
//                     : index <= completedSteps
//                     ? "bg-white hover:bg-gray-200"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//                 onClick={() => {
//                   if (index <= completedSteps) {
//                     setActiveTab(index);
//                     setSelfAppraisalPage(0);
//                   }
//                 }}
//                 disabled={index > completedSteps}
//               >
//                 {tab}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="flex-1 p-8 ml-44 -mt-10 ">
// 		 <HorizontalStepper
//           steps={TABS}
//           activeStep={activeTab}
//           completedSteps={completedSteps}
//         />				  

// 	  <div className="border p-4 rounded mt-10 shadow-lg">
// 				 {userDetails && (
//             <div className="mb-4 flex justify-between">
//               {/* <h3 className="text-xl font-bold text-blue-900">
//                 Employee Details
//               </h3> */}
//               <p className="text-blue-900 text-xl">
//                 <strong>Name:</strong> {userDetails.empName}
//               </p>
//               <p className="text-blue-900 text-xl">
//                 <strong>Designation:</strong> {userDetails.designation}
//               </p>
//               <p className="text-blue-900 text-xl">
//               <strong>Band:</strong>{userDetails.band}
//               </p>
//             </div>
//           )}		   

// 					 {activeTab === 0 && (
//             <IntroductionTab
//               handlePreviousForm={handlePreviousForm}
//               handleContinue={handleContinue}
//               instructionsList={instructionsList}
//               impInstructions={impInstructions}
//             />
//           )}
//           {activeTab === 1 && (
//             <SelfAppraisalTab
//               selfAppraisalPage={selfAppraisalPage}
//               weights={weights} // Pass the weights to SelfAppraisalTab
//               notes={notes} // Pass the notes to SelfAppraisalTab
//               updateWeight={updateWeight}
//               saveNotes={saveNotes}
//               handlePreviousForm={handlePreviousForm}
//               handleContinue={handleContinue}
//               questionsAndAnswers={questionsAndAnswers}
//             />
//           )}
//           	 {/* {activeTab === 2 && (
//              <SelfAppraisal2
//              selfAppraisalPage={selfAppraisalPage}
//              weights={weights} // Pass the weights to SelfAppraisalTab
//              notes={notes} // Pass the notes to SelfAppraisalTab
//              updateWeight={updateWeight}
//              saveNotes={saveNotes}
//              handlePreviousForm={handlePreviousForm}
//              handleContinue={handleContinue}
//              questionsAndAnswers={questionsAndAnswers}
//            />
//           )} */}
//           {activeTab === 2 && (
//             <GoalsTab
//             goalsResponse={goalsResponse}
//             goalAnswers={goalAnswers}
//             handleGoalChange={handleGoalChange}
//             handlePreviousForm={handlePreviousForm}
//             handleSubmit={handleSubmit}
//           />
//           )}
//         </div>
//         {isModalOpen && (
//          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//          <div className="bg-white p-5 rounded-lg shadow-lg transform transition-all duration-300 scale-95 hover:scale-100">

//              <h2 className="text-lg font-semibold text-center text-gray-800 mb-5">Submit Confirmation</h2>
//            <p className="text-gray-800 mb-6 text-center">Are you sure you want to submit your appraisal?</p>
//            <div className="mt-6 flex  justify-between space-x-4">
//              <button
//                className="bg-blue-600 w-1/2 text-white px-5 py-2 rounded-lg transition duration-300 transform hover:bg-blue-500 hover:scale-105"
//                onClick={() => handleConfirmSubmit()}
//              >
//                Yes
//              </button>

//              <button
//                className="bg-red-600 w-1/2 text-white px-5 py-2 rounded-lg transition duration-300 transform hover:bg-red-500 hover:scale-105"
//                onClick={closeModal}
//              >
//                No
//              </button>
//            </div>
//          </div>
//        </div>


//         )}


//         {isThankYouModalOpen && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">


//             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//          <div className="bg-white p-5 rounded-lg shadow-lg transform transition-all duration-300 scale-95 hover:scale-100">

//              <h2 className="text-lg font-semibold text-center text-gray-800 mb-5">Thank you! </h2>
//            <p className="text-gray-800 mb-6 text-center">You have successfully submitted your appraisal</p>


//            <div className="mt-6 flex  justify-between space-x-4">
//              <button
//                className="bg-blue-600 w-full text-white px-5 py-2 rounded-lg transition duration-300 transform hover:bg-blue-500 hover:scale-105"
//                onClick={closeThankYouModal}
//              >
//                Close
//              </button>


//            </div>
//          </div>
//        </div>
//           </div>


//         )}
//       </div>
//     </div>
//   );
// };

// export default EmpForm

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
import Goals2 from "../Tabs/Goals";
import Goals from "../Tabs/goalsTab";

const TABS = ["Introduction", "Self Appraisal", "Goals"];

const EmpForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [weights, setWeights] = useState(Array(15).fill(0));
  const [notes, setNotes] = useState(Array(15).fill(""));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selfAppraisalPage, setSelfAppraisalPage] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [goalAnswers, setGoalAnswers] = useState(
    goalsResponse.map(() => ({ answer: "" }))
  );

  const location = useLocation();
  const { timePeriod } = location.state || {};

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
        setUserDetails(response.data.user);
        setEmail(response.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };

  const updateWeight = (index, percentage) => {
    const newWeights = [...weights];
    newWeights[index] = percentage;
    setWeights(newWeights);
  };

  const saveNotes = (index, data) => {
    const newNotes = [...notes];
    newNotes[index] = data;
    setNotes(newNotes);
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
      setActiveTab(activeTab + 1);
      setSelfAppraisalPage(0);
      setCompletedSteps(Math.max(completedSteps, activeTab + 1));
    }
  };

  const handlePreviousForm = () => {
    if (selfAppraisalPage > 0) {
      setSelfAppraisalPage(selfAppraisalPage - 1);
    } else if (activeTab > 0) {

      setActiveTab(activeTab - 1);
    } else if (activeTab === 0) {
      navigate("/employee-dashboard");
    }
  };


  const handleSubmit = async () => {
    setIsModalOpen(true);
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

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    setIsThankYouModalOpen(true);
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
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
        answer: goalAnswers[index].answer,
        notes: notes[index + 13],
      })),

    ];


    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));

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
    navigate("/employee-dashboard");
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
            handleContinue={handleContinue}

          />
        )}
        {activeTab === 2 && (
          <Goals2
            goalsResponse={goalsResponse}
            goalAnswers={goalAnswers}
            handleGoalChange={handleGoalChange}
            handlePreviousForm={handlePreviousForm}
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

export default EmpForm;