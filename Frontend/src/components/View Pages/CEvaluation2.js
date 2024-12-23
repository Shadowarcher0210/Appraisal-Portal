import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  TrendingUp,
  Medal,
} from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { questionsAndAnswersEmployee } from "../employee/EmpAppraisalQuestions";
import {AdditionalAreas} from "./AdditionalAreas"

const CEvaluation2 = () => {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { employeeId } = useParams();
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const [attainments, setAttainments] = useState(Array(5).fill(''));
  const [comments, setComments] = useState(Array(5).fill(''));
 

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
          pageData: questionsAndAnswersEmployee.map((qa, index) => ({
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

  const handleContinue = async () => {
    navigate(`/CES/${employeeId}`, { state: { timePeriod } });
  };
  const handleBack = () => {
    navigate(`/CE1/${employeeId}`, { state: { timePeriod } });
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
    <div className="min-h-screen bg-blue-50 p-4 w-full ">
      <div className="mt-14">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Employee Additional Areas</h1>
            {formData ? (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white text-cyan-800  px-3 py-2 font-medium rounded">
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
      <div className="space-y-4 mx-2 rounded-lg ">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4">
          <div className="flex items-center mb-4 border-b ">
            <Medal className="text-cyan-700 mr-2 "/>
              <h2 className="text-xl font-semibold text-cyan-800 mt-1  pb-2 flex items-center gap-2"> Additional Areas of Assessment       </h2>
          </div>
                
      <div className="overflow-x-auto">
        <table className="w-full border-collapse ">
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
          <tbody className="my-6">
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
                    className="hover:bg-gray-50 transition-colors duration-200 group border-b "
                  >
                    <td className="p-4 text-sm font-medium text-gray-700 group-hover:text-cyan-800">
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
                      {attainments[index]}
                      
                    </td>
                    <td className="p-2">
                      {comments[index]}
                        
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

        <div className="mt-20 sticky flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
    
          <div >
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleContinue}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEvaluation2;