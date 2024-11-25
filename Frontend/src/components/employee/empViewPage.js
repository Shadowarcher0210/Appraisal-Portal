import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp,  Award, } from 'lucide-react';
import tick from '../../assets/tick.svg'
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const EmpViewPage = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [email, setEmail] = useState(""); // If you're using a state to store the email
 const [additionalAreas , setAdditionalAreas] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const currentYear = new Date().getFullYear() + 1;
  const location = useLocation();
  const { timePeriod } = location.state || {}

  // Static questions and answers
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
            managerEvaluation: response.data[0]?.pageData[index]?.managerEvaluation

          }))

        };
        console.log("res check for eval", initialFormData);

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
// useEffect(()=>{
  
//   const getAdditionalDetails = async () =>{
//     try{
      
//       // if(formData[0].status === 'Completed'){
//     const response = await axios.get(`http://localhost:3003/appraisal/getAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`)
//     console.log('Getting Additional Areas',response.data)
// setAdditionalAreas(response.data)
//       // }
//     }catch{
//       console.error('Error in fetching Additional Areas:',error)
//     }
  
// }
// getAdditionalDetails();
// },)

useEffect(() => {
  const getAdditionalDetails = async () => {
    // Make sure formData is loaded and contains status
    if (formData && formData[0]?.status === 'Completed') {
      try {
        const response = await axios.get(
          `http://localhost:3003/appraisal/getAdditionalDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );
        console.log('Getting Additional Areas', response.data);
        setAdditionalAreas(response.data.data.areas);
        console.log("Additional Areas in EMP view page :",response.data.data.areas)
      } catch (error) {
        console.error('Error in fetching Additional Areas:', error);
      }
    } else {
      // Optionally handle the case when status is not 'Completed'
      console.log('Appraisal status is not completed. Skipping fetching additional details.');
    }
  };

  // Only run if formData is loaded
  if (formData && formData[0]?.status) {
    getAdditionalDetails();
  }
})
  const goals = [
    { title: 'Cloud Certification', description: 'Obtain AWS Solutions Architect certification', deadline: 'Q2 2025' },
    { title: 'Team Mentoring', description: 'Mentor 2 junior developers', deadline: 'Q3 2025' },
    { title: 'Process Improvement', description: 'Lead automation initiative', deadline: 'Q4 2025' },
  ];
  const status = formData ? formData.status : null

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
            ) : (<div />)}
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
          </div>) : (<div />)}
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


                  {formData[0].status === 'Completed' && (
                    <th className="p-2 border-b border-gray-200 text-left text-sm font-medium text-gray-800">
                      Manager Evaluation
                    </th>
                  )
                  }

                </tr>
              </thead>
              <tbody>
                {questionsAndAnswers.map((item, index) => {
                  const previousAnswer = formData ? formData[0].pageData[index]?.answer : null;
                  console.log("prev ans", previousAnswer)
                  const notes = formData ? formData[0].pageData[index]?.notes : null;
                  const weights = formData ? formData[0].pageData[index]?.weights : null;

                  const managerEvaluation = formData ? formData[0].pageData[index]?.managerEvaluation : null;
                  console.log("eval", managerEvaluation)
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
                      ) : (<td className="p-2 text-sm text-gray-700">
                        <span className="text-gray-600">No notes to display</span>
                      </td>
                      )}
                      {weights ? (
                        <td className="p-2 text-sm text-gray-700 text-center ">
                          <span className="text-gray-600">{weights} %</span>
                        </td>
                      ) : (<td className="p-2 text-sm text-gray-700">
                        <span className="text-gray-600">-</span>
                      </td>
                      )}
                      {formData[0].status === 'Completed' && (
                        <td className="p-2 text-sm text-gray-600 text-center">

                          <span className="text-gray-600 ">{managerEvaluation} %</span>

                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {formData[0].status==="Completed"&&(
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
                 {additionalAreas.map((item, index) => {
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
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                           {item.attainments}%
                         </span>
                       </td>
 
                       <td className="border-l border-r text-center">
                        {item.comments ?(
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                           {item.comments}
                         </span>
                        ):(<span className="px-2 text-blue-600 text-center  py-1 rounded">
                          -
                        </span>)}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         </div>
        )}


      </div>

    </div>
  );
};

export default EmpViewPage;