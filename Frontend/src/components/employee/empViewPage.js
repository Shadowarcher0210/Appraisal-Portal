
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';
import tick from '../../assets/tick.svg'
import { useLocation } from 'react-router-dom';

const EmpViewPage = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);

  const employeeId = localStorage.getItem('employeeId');
  const currentYear = new Date().getFullYear() + 1;
  const nextYear = currentYear + 1;
const location = useLocation();
const {timePeriod}=location.state || {}
  // Static questions and answers
  const questionsAndAnswers = [
    { question: 'Job-Specific Knowledge', answer: 'I possess and apply the expertise, experience, and background to achieve solid results.' },
    { question: 'Team Work', answer: 'I work effectively and efficiently with team.' },
    { question: 'Job-Specific Skills', answer: 'I demonstrate the aptitude and competence to carry out my job responsibilities.' },
    { question: 'Adaptability', answer: 'I am flexible and receptive regarding new ideas and approaches.' },
    { question: 'Leadership', answer: 'I like to take responsibility in managing the team.' },
    { question: 'Collaboration', answer: 'I cultivate positive relationships. I am willing to learn from others.' },
    { question: 'Communication', answer: 'I convey my thoughts clearly and respectfully.' },
    { question: 'Time Management', answer: 'I complete my tasks on time. '},
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

   useEffect(()=>{
    const appraisalDetails = async () => {
      if (employeeId) {
          try {
              const response = await axios.get(`http://localhost:3003/form/displayAnswers/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`);
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
     },[])

    const goals = [
      { title: 'Cloud Certification', description: 'Obtain AWS Solutions Architect certification', deadline: 'Q2 2025' },
      { title: 'Team Mentoring', description: 'Mentor 2 junior developers', deadline: 'Q3 2025' },
      { title: 'Process Improvement', description: 'Lead automation initiative', deadline: 'Q4 2025' },
    ];

  return (
          <div className="min-h-screen bg-gray-100 p-4 w-full ">

      
      {/* <h1 className=" mt-8 text-2xl font-bold ">Appraisal Details</h1> */}
      <div className="mb-2">

   {/* Header Section */}
   <div className="bg-blue-600 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Appraisal Details</h1>
            {formData ? (

            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-50 text-blue-600  px-3 py-2 font-medium rounded">
              {new Date(formData[0].timePeriod[0]).toISOString().slice(0, 10)} to {new Date(formData[0].timePeriod[1]).toISOString().slice(0, 10)}
              </span>
             
            </div>
            ):(<div/>)}
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
        <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
        <p className="font-medium text-gray-900">-</p>
      </div>
    </div>
  </div>):(<div/>)}
</div>

 {/* Main Content - Vertical Layout */}
 <div className="space-y-4 mx-2 rounded-lg shadow-sm">
          {/* Self Appraisal Section */}

<div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
    <Award size={20} className="text-blue-600" />
    Self Appraisal & Competencies
  </h2>
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Areas of Self Assessment</th>
          <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Requirement</th>
          <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Response</th>
          <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Notes</th>
          <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Attainment</th>
        </tr>
      </thead>
      <tbody>
        {questionsAndAnswers.map((item, index) => {
          const previousAnswer = formData ? formData[0].pageData[index]?.answer : null;
          console.log("prev ans",previousAnswer)
          const notes = formData ? formData[0].pageData[index]?.notes : null;

          return (
            <tr key={index} className="border-b border-gray-200 ">
              <td className="p-2 text-sm font-medium text-gray-500 ">{item.question}</td>
              <td className="p-2 text-sm text-gray-700 w-86">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.answer}</span>
              </td>
              {previousAnswer ? (
                <td className="p-2 text-sm text-gray-700 w-48">
                  <div className="flex items-center gap-2 mb-1 bg-gray-100 p-1 rounded">
                    <img src={tick} size={14} className="text-gray-400" />
                    <span className="text-gray-600 px-2 py-1 rounded">{previousAnswer}</span>
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
                 ):( <td className="p-2 text-sm text-gray-700">
                       <span className="text-gray-600">-</span>
                      </td>
                 )}                            
                <td className="p-2 text-sm text-gray-700 w-40">
                  <span className="text-gray-600">No data available</span>
                </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

{/* Competencies Section */}
{/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Target size={20} className="text-purple-600" />
            Competencies
          </h2>
          <div className="space-y-3 pr-4">
            {competencies.map((comp, index) => (
              <div key={index} className="bg-gray-100 rounded p-3">
                <p className="text-sm font-medium text-gray-700">{comp.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    Current: {comp.level}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Target: {comp.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}

   {/* Goals Section */}
   <div className="bg-white border border-gray-200 mb-8 rounded-lg shadow-sm p-4 mt-3">
         {formData ?(
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target size={20} className="text-green-600" />
               Goals for  
               {` ${new Date(formData[0].timePeriod[0]).getFullYear()+1} - ${new Date(formData[0].timePeriod[1]).getFullYear()+1}`}
               <br/>
            </h2>):(<div/>)}
            <div className="space-y-3 pr-4">
              {goals.map((goal, index) => (
                <div key={index} className="bg-gray-100 rounded p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-700">{goal.title}</p>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                      {goal.deadline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
</div>

    </div>
  );
};

export default EmpViewPage;