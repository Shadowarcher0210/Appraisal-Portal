
const SelfAppraisalTab = ({
  selfAppraisalPage,
  weights,
  notes,
  updateWeight,
  saveNotes,
  handlePreviousForm,
  handleContinue,
  
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

  return (
<div className="relative h-full flex flex-col overflow-y-auto max-h-[550px] scrollbarwidth-thin">      {/* {selfAppraisalPage === 0 && ( */}
        <>
          <h1 className="font-normal">
            Please select your response for self appraisal
          </h1>
          <table className="border border-gray-800 w-full mt-4 rounded-lg">
            <thead className="border border-blue-500 bg-blue-500 rounded-lg">
              <tr className="text-white font-medium text-center text-md">
                <td className="border-r border-gray-800">
                  Self-Assessment Areas
                </td>
                <td className="border-r border-gray-800 p-2">
                  Strongly Disagree
                </td>
                <td className="border-r border-gray-800">Somewhat Disagree</td>
                <td className="border-r border-gray-800">Agree</td>
                <td className="border-r border-gray-800">Somewhat Agree</td>
                <td className="border-r border-gray-800">Strongly Agree</td>
                <td className="border-r border-gray-800">Notes</td>
                <td className="border-r border-gray-800">Weight</td>
                <td className="border-r border-gray-800">Attainment</td>
              </tr>
            </thead>
            <tbody>
              {/* Render general questions */}
              {generalQuestions.map((text, index) => (
                <tr key={`general-question-${index}`} className="text-center">
                  <td className="border p-2 border-gray-800 w-96">{text}</td>
                  {[20, 40, 60, 80, 100].map((value) => (
                    <td className="border border-gray-800" key={value}>
                      <input
                        type="radio"
                        name={`feedback-general-${index}`}
                        onChange={() => updateWeight(index, value)}
                      />
                    </td>
                  ))}
                  <td className="border p-0 border-gray-800 w-24">
                    <textarea
                      className="w-full h-full outline-none border-none resize-none"
                      value={notes[index]}
                      onChange={(e) => saveNotes(index, e.target.value)}
                    ></textarea>
                  </td>
                  <td className="border p-2 border-gray-800 w-20"></td>
                  <td className="border p-2 border-gray-800">
                    {weights[index]}%
                  </td>
                </tr>
              ))}

              {/* Render Competency Section Header */}
              <tr className="bg-gray-100">
                <td
                  colSpan="9"
                  className="text-center font-semibold p-2 text-lg border border-gray-800"
                >
                  Competencies
                </td>
              </tr>

              {/* Render competency questions */}
              {competencyQuestions.map((text, index) => (
                <tr
                  key={`competency-question-${index}`}
                  className="text-center"
                >
                  <td className="border p-2 border-gray-800 w-96">{text}</td>
                  {[20, 40, 60, 80, 100].map((value) => (
                    <td className="border border-gray-800" key={value}>
                      <input
                        type="radio"
                        name={`feedback-competency-${index}`}
                        onChange={() =>
                          updateWeight(generalQuestions.length + index, value)
                        }
                      />
                    </td>
                  ))}
                  <td className="border p-0 border-gray-800 w-24">
                    <textarea
                      className="w-full h-full outline-none border-none resize-none"
                      value={notes[generalQuestions.length + index]}
                      onChange={(e) =>
                        saveNotes(generalQuestions.length + index, e.target.value)
                      }
                    ></textarea>
                  </td>
                  <td className="border p-2 border-gray-800 w-20"></td>
                  <td className="border p-2 border-gray-800">
                    {weights[generalQuestions.length + index]}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</>
          
            {/* // )} */}



<div className="sticky bottom-0 bg-white py-4 flex justify-end space-x-2">
            <button
              className="bg-orange-400  hover:bg-orange-500 rounded-lg p-2 text-white px-4 mr-auto"
              onClick={handlePreviousForm}
            >
              Back
            </button>
            <button
              className="bg-orange-400  hover:bg-orange-500 rounded-lg p-2 text-white px-4 "
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
   </div>
  );
}; 

export default SelfAppraisalTab;