import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp } from 'lucide-react';
import tick from '../../assets/tick.svg'
import { useLocation } from "react-router-dom";

const SelfAppraisal = ({
  weights = [],
  notes = [],
  updateWeight,
  saveNotes,
  handlePreviousForm,
  handleSubmit,
  handleSave,

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
    "Results: I identify goals that are aligned with the organization's strategic direction and achieve results accordingly.",
    "Creativity: I look for solutions outside the work.",
    "Initiative: I anticipate needs, solve problems, and take action, all without explicit instructions.",
    "Client Interaction: I take the initiative to help shape events that will lead to the organization's success and showcase it to clients.",
    "Software Development: I am committed to improving my knowledge and skills.",
    "Growth: I am proactive in identifying areas for self-development.",
  ];

  const totalQuestions = generalQuestions.length + competencyQuestions.length;
  const initializedWeights = Array(totalQuestions).fill(0);
  const initializedNotes = Array(totalQuestions).fill("");

  const savedWeights = JSON.parse(localStorage.getItem('weights')) || initializedWeights;
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || initializedNotes;
  const [currentWeights, setCurrentWeights] = useState(savedWeights);
  const [currentNotes, setCurrentNotes] = useState(savedNotes);

  useEffect(() => {
    localStorage.setItem('weights', JSON.stringify(currentWeights));
    localStorage.setItem('notes', JSON.stringify(currentNotes));
  }, [currentWeights, currentNotes]);

  const updateWeightAndSave = (index, value) => {
    const updatedWeights = [...currentWeights];
    updatedWeights[index] = value;
    setCurrentWeights(updatedWeights);
    updateWeight?.(index, value);
  };

  const saveNotesAndSave = (index, value) => {
    const updatedNotes = [...currentNotes];
    updatedNotes[index] = value;
    setCurrentNotes(updatedNotes);
    saveNotes?.(index, value);
  };

  const [formData, setFormData] = useState(null);
  const employeeId = localStorage.getItem('employeeId');

  const getAttainmentColor = (weight) => {
    if (weight >= 80) return 'bg-orange-100 text-orange-800';
    if (weight >= 60) return 'bg-blue-100 text-blue-800';
    if (weight >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAttainmentText = (weight) => {
    if (weight >= 80) return 'Exceptional';
    if (weight >= 60) return 'Meets Expectations';
    if (weight >= 40) return 'Needs Improvement';
    return 'Unsatisfactory';
  };

  useEffect(() => {
    const appraisalDetails = async () => {
      if (employeeId) {
        try {
          const response = await axios.get(`http://localhost:3003/all/details/${employeeId}`);
          setFormData(response.data);
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



  const isFormComplete = () => currentWeights.every(weight => weight > 0);

  const handleFormSubmit = () => {
    if (isFormComplete()) {
      console.log("filled");
      handleSubmit();
    } else {
      alert("Please complete all fields before submitting.");
    }
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
                <p className="font-medium text-gray-900">In Progress</p>
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
                <td className="p-3 text-center w-28">Agree</td>
                <td className="p-3 text-center">Somewhat Agree</td>
                <td className="p-3 text-center">Strongly Agree</td>
                <td className="p-3 text-center w-1/4">Notes & Comments</td>
                <td className="p-3 rounded-tr-lg text-center">Attainment</td>
              </tr>
            </thead>
            <tbody>
              {generalQuestions.map((text, index) => (
                <tr key={`general-${index}`} className="border-b hover:bg-gray-50  ">
                  <td className="p-4 border-l">{text}</td>
                  {[20, 40, 60, 80, 100].map((value) => (
                    <td key={value} className="text-center border-l">
                      <input
                        type="radio"
                        name={`feedback-general-${index}`}
                        checked={currentWeights[index] === value}
                        onChange={() => updateWeightAndSave(index, value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  ))}

                  <td className="border-l text-center">
                    <textarea
                      className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={currentNotes[index] || ""}
                      onChange={(e) => saveNotesAndSave(index, e.target.value)}
                      rows="2"
                      placeholder="Add your comments..."
                    />
                  </td>
                  <td className="border-l  border-r ">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium  ${getAttainmentColor(currentWeights[index])}`}>
                      {getAttainmentText(currentWeights[index])}
                    </span>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan="8" className="bg-gradient-to-r from-blue-100 to-orange-100 p-4 font-semibold text-lg">
                  Competencies
                </td>
              </tr>

              {competencyQuestions.map((text, index) => (
                <tr key={`competency-${index}`} className="border-b hover:bg-gray-50">
                  <td className="p-4 border-l">{text}</td>
                  {[20, 40, 60, 80, 100].map((value) => (
                    <td key={value} className="text-center border-l">
                      <input
                        type="radio"
                        name={`feedback-competency-${index}`}
                        checked={currentWeights[generalQuestions.length + index] === value}
                        onChange={() => updateWeightAndSave(generalQuestions.length + index, value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="border-l border-r">
                    <textarea
                      className="w-full p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                      value={currentNotes[generalQuestions.length + index] || ""}
                      onChange={(e) => saveNotesAndSave(generalQuestions.length + index, e.target.value)}
                      rows="2"
                      placeholder="Add your comments..."
                    />
                  </td>
                  <td className="border-l border-r text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttainmentColor(currentWeights[generalQuestions.length + index])}`}>
                      {getAttainmentText(currentWeights[generalQuestions.length + index])}
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
            className={`px-6 py-2 rounded-lg transition-colors ${isFormComplete() ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-300 text-white cursor-not-allowed'
              }`}
            onClick={handleFormSubmit}
            disabled={!isFormComplete()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfAppraisal;