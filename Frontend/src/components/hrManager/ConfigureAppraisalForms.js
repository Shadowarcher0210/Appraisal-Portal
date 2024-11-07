import React, { useState } from 'react';
import goalSettingImg from '../../assets/goal-setting.png';
import evaluationImg from '../../assets/evaluation.png';
import trainingImg from '../../assets/training.png';
import growthImg from '../../assets/growth.png';

const ConfigureAppraisalForms = () => {
  const [selectedSection, setSelectedSection] = useState('Introduction');
  const [showPopup, setShowPopup] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [goalStatement, setGoalStatement] = useState('');
  const [goals, setGoals] = useState([]);
  const [jobRoles] = useState(['Software Engineer', 'Product Manager', 'Designer']);

  const handleAddGoal = () => {
    if (goalStatement) {
      setGoals([...goals, goalStatement]);
      setGoalStatement('');
    }
    setShowPopup(false);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'Introduction':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Performance Management Process</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <img src={goalSettingImg} alt="Goal Setting" className="w-32 h-32 mb-4" />
                <p className="font-semibold">Goal Setting</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={evaluationImg} alt="Evaluation" className="w-32 h-32 mb-4" />
                <p className="font-semibold">Evaluation</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={trainingImg} alt="Training" className="w-32 h-32 mb-4" />
                <p className="font-semibold">Training</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={growthImg} alt="Growth" className="w-32 h-32 mb-4" />
                <p className="font-semibold">Growth</p>
              </div>
            </div>
            <h3 className="text-lg font-bold mt-4">Instructions, Steps and FAQs</h3>
            <p className="mb-2">
              This appraisal system allows you to provide your feedback and ratings against your performance targets. The following is the process of appraisal:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>You fill your appraisal and submit to your manager.</li>
              <li>Your manager fills their comments and ratings for your appraisal and submits to HR.</li>
              <li>HR finalizes your appraisal.</li>
              <li>Your manager discusses the appraisal with you and submits for your acceptance.</li>
              <li>You accept the appraisal to close the process for this year.</li>
            </ul>
            <h3 className="text-lg font-bold text-red-600">Important Instructions:</h3>
            <ul className="list-disc list-inside">
              <li>
                It is mandatory to provide ratings and comments against all Competencies in the Competency Form and Goals in the Goal Sheet form. These ratings help you in defining your achievements as also help your manager in entering ratings and comments while filling up your appraisal.
              </li>
              <li>
                As a good practice, go through all the forms and understand what data is required to be filled in. While you can complete the appraisal in multiple sittings, it may be a good idea to collect all the details prior to starting to fill in the forms.
              </li>
            </ul>
          </div>
        );
      case 'Competencies':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Competencies

              <span
                className="ml-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowHelp(!showHelp)}
              >
                ?
              </span>
            </h2>


            {showHelp && (
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md mb-4">
                <h3 className="text-lg font-bold mb-2">Form Details</h3>
                <p>This form contains the competencies that are applicable to your organization.</p>
                <p>Select a rating for each competency and provide detailed comments to support the rating.</p>
                <p>Based on your ratings and the weight of the competency, a development plan will be created for the employee.</p>

                <h3 className="text-lg font-bold mt-4 mb-2">Help on Ratings</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-2">Rating</th>
                      <th className="border-b p-2">Score</th>
                      <th className="border-b p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">Do not Agree</td>
                      <td className="p-2">1</td>
                      <td className="p-2">The competency is not exhibited.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Slightly in Agreement</td>
                      <td className="p-2">2</td>
                      <td className="p-2">The competency is exhibited some of the times.</td>
                    </tr>
                    <tr>
                      <td className="p-2">In fair Agreement</td>
                      <td className="p-2">3</td>
                      <td className="p-2">The competency is exhibited often according to the role requirements.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Mostly in Agreement</td>
                      <td className="p-2">4</td>
                      <td className="p-2">The competency is exhibited most of the times.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Fully Agree</td>
                      <td className="p-2">5</td>
                      <td className="p-2">The competency is exhibited always.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Competencies Content */}
            <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md w-full">
              <h3 className="text-lg font-bold mb-2">Professional Competence</h3>
              <p>Highly knowledgeable in their own field and keeps fully updated with latest developments.</p>
              <p>Team members cluster around him/her to gain professional knowledge.</p>
              <p>Actively participates in discussions with leadership in how to improve professional integrity.</p>

              <h3 className="text-lg font-bold mt-4">Communication Skills</h3>
              <p>Has outstanding capability to converse in English, both in writing & orally.</p>
              <p>Has excellent presentation skills and is able to skillfully utilize Microsoft tools like Excel, Word, PPT & others.</p>
              <p>Is a highly attentive listener and can grasp, retain, and reproduce the information so acquired.</p>

              <h3 className="text-lg font-bold mt-4">Focus On People Development</h3>
              <p>Personally knows the capability profile of each member of the team & is interested to improve the same.</p>
              <p>Has excellent coaching & mentoring skills.</p>
              <p>Fully understands & implements organized training to produce multi-skilled people in the team.</p>
              <p>Has contributed immensely to defining the goals of each of their team members and has a mechanism in place to continuously track performance.</p>

              <h3 className="text-lg font-bold mt-4">Self Learning Drive</h3>
              <p>Actively participates in self-learning programs and maintains accreditation scores.</p>
              <p>Massively contributes articles in professional journals and writes blogs on social media.</p>
              <p>Has made exceptional contributions to improvements in safety, health & work environment.</p>
              <p>Organizes activities beyond job commitments and voluntarily works for extended hours on process improvement initiatives.</p>

              <h3 className="text-lg font-bold mt-4">Strategic Thinking Capability</h3>
              <p>Is fully aware of the Vision, Values & Core Competencies of the organization. Knows how to utilize the same.</p>
              <p>Fully understands the strategy, both long-term & short-term to sustain in the market.</p>
              <p>Knows the goals & objectives of the department and their linkage with financial objectives of the organization.</p>
              <p>Has good understanding of the organization's 'Go to market' strategy.</p>

              <h3 className="text-lg font-bold mt-4">Business Acumen</h3>
              <p>Has full knowledge of the products & services that the organization is offering in the market.</p>
              <p>Is fully conversant with the existing competition, market size, our present share in the market & business objectives.</p>
              <p>Has excellent analytical reasoning ability to identify the approach to capture maximum market share.</p>

              <h3 className="text-lg font-bold mt-4">Leadership Potential</h3>
              <p>Is highly creative in their thinking and always provides 'out of the box' implementable solutions.</p>
              <p>Makes quick decisions in stressful and high-pressure situations.</p>
              <p>Willingly collaborates with all stakeholders in business to create a win-win situation.</p>
              <p>Has a high order of conceptual clarity in managing conflicts and creates an environment for smooth functioning of the organization.</p>
            </div>
          </div>
        );
      // Inside the ConfigureAppraisalForms component

      case 'Goals':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Goals
              {/* Help icon (question mark) */}
              <span
                className="ml-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowHelp(!showHelp)} // Toggle help popup
              >
                ?
              </span>
            </h2>

            {/* Help information popup for Goals */}
            {showHelp && (
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md">
                <h3 className="text-lg font-bold mb-2">Form Details</h3>
                <p>» Employees can mutually discuss and decide goals at the start of the year. Add goals that are already decided and employees can also mention some additional goals achieved during the performance period.</p>
                <p>» Goals should be SMART (Specific, Measurable, Achievable, Reviewable, Time-based).</p>
                <p>» Add at least 5 goals and add achievements for each goal periodically.</p>
                <p>» Provide your ratings and comments for each goal at the end of the year. Your comments will help your manager to provide accurate and constructive feedback.</p>

                <h3 className="text-lg font-bold mt-4 mb-2">Help on Ratings</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-2">Rating</th>
                      <th className="border-b p-2">Score</th>
                      <th className="border-b p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">Did not achieve</td>
                      <td className="p-2">1</td>
                      <td className="p-2">You could not achieve the goal.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Partly achieved</td>
                      <td className="p-2">2</td>
                      <td className="p-2">You could partially achieve the goal.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Completely achieved</td>
                      <td className="p-2">3</td>
                      <td className="p-2">You have achieved all the objectives associated with the goal.</td>
                    </tr>
                    <tr>
                      <td className="p-2">Overachieved</td>
                      <td className="p-2">4</td>
                      <td className="p-2">You have exceeded the objectives associated with the goal.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-lg font-semibold mb-4">In this section, you can set specific goals for appraisals.</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => setShowPopup(true)} // Show popup when clicked
            >
              Add Goal
            </button>

            {/* Popup Modal for Adding Goals */}
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">Select an Option</h3>

                  {/* Radio Buttons for Selection */}
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="newGoal"
                        checked={selectedOption === 'newGoal'}
                        onChange={() => setSelectedOption('newGoal')}
                      />
                      <span>New Goal</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="goalLibrary"
                        checked={selectedOption === 'goalLibrary'}
                        onChange={() => setSelectedOption('goalLibrary')}
                      />
                      <span>Goal Library</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="allJobRoles"
                        checked={selectedOption === 'allJobRoles'}
                        onChange={() => setSelectedOption('allJobRoles')}
                      />
                      <span>All Job Roles</span>
                    </label>
                  </div>

                  {/* Conditional Rendering based on selection */}
                  {selectedOption === 'newGoal' && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Statement</h4>
                      <input
                        type="text"
                        placeholder="Enter Goal Statement"
                        value={goalStatement}
                        onChange={(e) => setGoalStatement(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md mt-2"
                      />
                    </div>
                  )}

                  {selectedOption === 'goalLibrary' && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Goal Library</h4>
                      <ul className="list-disc list-inside">
                        {goals.length === 0 ? (
                          <p>No goals added yet.</p>
                        ) : (
                          goals.map((goal, index) => <li key={index}>{goal}</li>)
                        )}
                      </ul>
                    </div>
                  )}

                  {selectedOption === 'allJobRoles' && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Job Roles</h4>
                      <select className="w-full border border-gray-300 p-2 rounded-md mt-2">
                        {jobRoles.map((role, index) => (
                          <option key={index} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                      onClick={() => setShowPopup(false)} // Close popup
                    >
                      Cancel
                    </button>
                    {selectedOption === 'newGoal' && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={handleAddGoal}
                      >
                        Add Goal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'Self Appraisal':
        return <p>Here, employees can conduct their self-appraisal.</p>;
      case '360 Feedback':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              360 Feedback
              {/* Help icon (question mark) */}
              <span
                className="ml-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowHelp(!showHelp)} // Toggle help popup
              >
                ?
              </span>
            </h2>

            {/* Help information popup for 360 Feedback */}
            {showHelp && (
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md mb-4">
                <h3 className="text-lg font-bold mb-2">360 Feedback Details</h3>
                <p>This form allows you to get feedback on this employee's competencies and goal achievements from other employees.</p>
                <p>This typically helps when your employees work with a number of other employees (outside of your team); typically seen in service departments.</p>
                <p>Click on Initiate Feedback to start a feedback session.</p>
                <p>Once the feedback is started, you can wait for the comments to come back such that you can incorporate them in the appraisal.</p>
                <p>You can complete the appraisal without getting the feedback from other employees.</p>
              </div>
            )}

            {/* Content for 360 Feedback Section */}
            <p>This section is for collecting 360-degree feedback from peers.</p>
            <button className="mt-4 bg-blue-500 text-white p-2 rounded">Initiate Feedback</button>
          </div>
        );

      case 'Development Plan':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Development Plan
              {/* Help icon (question mark) */}
              <span
                className="ml-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowHelp(!showHelp)} // Toggle help popup
              >
                ?
              </span>
            </h2>

            {/* Help information popup for Development Plan */}
            {showHelp && (
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md mb-4">
                <h3 className="text-lg font-bold mb-2">Development Plan Details</h3>
                <p>This form allows you and your manager to identify the key development needs.</p>
                <p>Specify data for the following sections:</p>
                <ul className="list-disc list-inside">
                  <li>Development Areas with description of the area, the timeline desired, and the plan for development.</li>
                  <li>The areas where competencies need to be developed with a timeline and a plan.</li>
                  <li>The Training programs that you want to attend in the next year.</li>
                  <li>Your career plan with the desired Job Role, Timeline, and the Development Plan to achieve the career goal.</li>
                </ul>
              </div>
            )}

            {/* Content for Development Plan Section */}
            <p>This section outlines the development plans for employees.</p>
          </div>
        );

      case 'Submit':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Submit
              {/* Help icon (question mark) */}
              <span
                className="ml-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowHelp(!showHelp)} // Toggle help popup
              >
                ?
              </span>
            </h2>

            {/* Help information popup for Submit Section */}
            {showHelp && (
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md mb-4">
                <h3 className="text-lg font-bold mb-2">Verify and Submit</h3>
                <p>This is the last step in the appraisal process.</p>
                <ul className="list-disc list-inside">
                  <li>A check will be performed on all forms and an error will be indicated if all attributes are not rated.</li>
                  <li>Once you have completed the process, click on the Submit button to move the evaluation to the next stage.</li>
                  <li>The manager rating will be visible once your manager completes the process.</li>
                </ul>
              </div>
            )}

            {/* Content for Submit Section */}
            <p>This is the submission section where you finalize your appraisal forms.</p>
          </div>
        );

      default:
        return <p>Select a section to view its content.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Appraisal Portal</h1>
      </header>

      <div className="flex flex-grow mt-8">
        {/* Left Navigation Panel */}
        <div className="hidden md:block w-1/6 bg-gray-300 border-r border-gray-400 p-4 ml-28">
          <h2 className="font-bold text-lg mb-4">Navigation</h2>
          <ul className="list-none p-0">
            {['Introduction', 'Competencies', 'Goals', 'Self Appraisal', '360 Feedback', 'Development Plan', 'Submit'].map((section) => (
              <li
                key={section}
                className="p-2 hover:bg-blue-200 cursor-pointer"
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-6 bg-white rounded-lg shadow-lg ml-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ConfigureAppraisalForms;