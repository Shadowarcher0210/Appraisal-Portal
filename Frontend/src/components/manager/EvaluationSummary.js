import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Briefcase, TrendingUp, BadgeCheck, CircleChevronDown } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { initialTableData, createTableData, getAttainmentStyle } from '../utils/TableData';

const EvaluationSummary = () => {
  const [userData, setUserData] = useState(null)
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const { employeeId } = useParams();
  const [performanceRating, setPerformanceRating] = useState('');
  const [areasOfGrowth,setareasOfGrowth] = useState('');
  const[summary,setsummary] =useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [documentName, setDocumentName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const empType = localStorage.getItem("empType");
  const [overallWeightage, setOverallWeightage] = useState('N/A');
  

  const performanceOptions = [
    { value: 'exceptional', label: 'Exceptional ' },
    { value: 'exceedsExpectations', label: 'Exceeds Expectations ' },
    { value: 'meetsExpectations', label: 'Meets Expectations ' },
    { value: 'needsImprovement', label: 'Needs Improvement ' },
    { value: 'unsatisfactory', label: 'Unsatisfactory ' }
  ];

  const [tableData, setTableData] = useState([initialTableData]);

  useEffect(() => {
    const fetchFilename = async () => {
      try {
        const response = await axios.head(`http://localhost:3003/letter/fetch/${employeeId}`);
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
        const extractedFilename = match ? match[1] : null;

        console.log("Response Headers:", response.headers);

        if (extractedFilename) {
          setDocumentName(extractedFilename);
          console.log("Extracted Document Name:", extractedFilename);
        } else {
          console.log('Filename not found in response headers.');
        }
      } catch (err) {
        console.error('Error fetching filename:', err);
        console.log('Failed to fetch the filename.');
      }
    };

    if (employeeId) {
      fetchFilename();
    }
  }, [employeeId]);


  const handlePerformanceChange = (e) => {
    setPerformanceRating(e.target.value);
  };



  const handleareasOfGrowth = (e) => {
    setareasOfGrowth(e.target.value);
  }

  const handlesummary = (e) =>{
    setsummary(e.target.value);
  }


  useEffect(() => {
    const fetchAllEvaluations = async () => {
      if (!employeeId || !timePeriod) {
        setError("Employee ID or time period not found");
        setLoading(false);
        return;
      }

      try {
        const overallEvaluationResponse = await axios.get(
          `http://localhost:3003/appraisal/overAllEvaluation/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        );
        console.log("Overall Evaluation Response Data:", overallEvaluationResponse.data);

        if (overallEvaluationResponse.data) {
          const evaluationData = overallEvaluationResponse.data;
          const selfAssessment = parseFloat(evaluationData.selfAssesment || 0);
          const managerRating = parseFloat(evaluationData.managerRating || 0);;
          const goalsOverAll = parseFloat(evaluationData.goalsOverAll || 0);
          const additionalAreasOverall = parseFloat(evaluationData.additionalAreasOverall || 0);
          const overallWeightage = selfAssessment + managerRating + goalsOverAll + additionalAreasOverall  ;
          
          if (evaluationData.performanceRating) {
            setPerformanceRating(evaluationData.performanceRating);
          }
          if (evaluationData.areasOfGrowth) {
            setareasOfGrowth(evaluationData.areasOfGrowth);
          }

          if(evaluationData.summary){
            setsummary(evaluationData.summary);
          }
  
          setOverallWeightage(overallWeightage.toFixed(2) || 'N/A');
         
          const updatedTableData = createTableData (
              evaluationData.selfAssesment,
              evaluationData.managerRating,
              evaluationData.goalsOverAll.toFixed(2),
              evaluationData.additionalAreasOverall,
              overallWeightage.toFixed(2)
          )
          setTableData(updatedTableData);
          console.log("Updated table data", updatedTableData);
        } else {
          console.log("No overall evaluation data found");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching appraisal details:", error);
        setError("Error fetching appraisal details");
        setLoading(false);
      }
    };

    fetchAllEvaluations();
  }, [employeeId, timePeriod]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:3003/form/userDetailsAppraisal/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`
        )
        setUserData(response.data)
        console.log("User Details in evaluation view 1", response.data)
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("User ID not found in local storage.");
    }
  };

  const handleBack = () => {
    navigate(`/evaluationView2/${employeeId}`, { state: { timePeriod } });
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);
    setIsThankYouModalOpen(true);

    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }

    try {
      let status;

      if (empType === "HR") {
        status = "Completed";
      } else {
        status = "Under HR Review";
      }

      const response = await fetch(
        `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        console.log("Status updated successfully");

        const calculatedWeightage = overallWeightage || "N/A";

        const weightageResponse = await fetch(
          `http://localhost:3003/appraisal/overAllWeightage/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }, 
            body: JSON.stringify({ overallWeightage: calculatedWeightage, performanceRating, areasOfGrowth,summary })
          }
        );

        if (weightageResponse.ok) {
          console.log("Overall weightage submitted successfully");
        } else {
          const weightageError = await weightageResponse.json();
          console.log(`Error submitting overall weightage: ${weightageError.message}`);
        }


        const emailUrl =
          empType === "HR"
            ? "http://localhost:3003/confirmationEmail/HRSubmitEmail"
            : "http://localhost:3003/confirmationEmail/managerSubmitEmail";

        const emailResponse = await fetch(emailUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId,
          }),
        });

        if (emailResponse.ok) {
          console.log("Email sent successfully");
        } else {
          const emailError = await emailResponse.json();
          console.log(`Error sending email: ${emailError.message}`);
        }
      } else {
        const errorData = await response.json();
        console.log(`Error updating status: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating status or sending email:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleSaveAndExit = async () => {
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }

    try {
      const calculatedWeightage = overallWeightage || "N/A";

      const weightageResponse = await fetch(
        `http://localhost:3003/appraisal/overAllWeightage/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            overallWeightage: calculatedWeightage,
            performanceRating,
            areasOfGrowth,
            summary
          }),
        }
      );

      if (weightageResponse.ok) {
        console.log("Overall weightage saved successfully");
        // navigate('/manager-performance');
        const empType = localStorage.getItem('empType')
        if (empType === 'Manager') navigate('/manager-performance');
        else if (empType === 'HR') navigate('/hr-performance')
      } else {
        const weightageError = await weightageResponse.json();
        console.log(`Error saving weightage: ${weightageError.message}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };


  const closeModal = () => setIsModalOpen(false);
  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    const empType = localStorage.getItem('empType')
    if (empType === 'Manager') navigate('/manager-performance');
    else if (empType === 'HR') navigate('/hr-performance')
  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileSelected(file);
      setFileName(file.name);

      const formData = new FormData();
      formData.append('appraisalLetter', file);

      try {
        const response = await axios.put(
          `http://localhost:3003/letter/upload/${employeeId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {
          setDocumentName(file.name)
          console.log('File uploaded successfully');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 w-full">
      <div className="mt-14">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mt-4 mb-6">
      

        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Overall Feedback</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-white text-cyan-800 px-3 py-2 font-medium rounded">
                {new Date(timePeriod[0]).toISOString().slice(0, 10)} to{" "}
                {new Date(timePeriod[1]).toISOString().slice(0, 10)}
              </span>
            </div>
          </div>



        </div>
      </div>

      <div className="mb-6">
        {userData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-2 pr-4">
              <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Employee Name</p>
                  <p className="font-medium text-gray-900">{userData.empName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
                <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                  <Briefcase className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Designation</p>
                  <p className="font-medium text-gray-900">
                    {userData.designation}
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
                    {userData.managerName}
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
                  <p className="font-medium text-gray-900">{overallWeightage}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 mx-2">
              <div className="bg-white w-full rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex items-center mb-4 border-b ">
          <BadgeCheck className="text-cyan-700 mr-2"/>
          <h2 className="text-xl font-semibold text-cyan-800 my-2 mt-3 pb-2 flex items-center gap-2">
          Performance Review
          </h2>
          </div>
                <h2 className="text-md font-medium text-gray-600 mb-4">Evaluation Rating</h2>
                <select
                  value={performanceRating}
                  onChange={handlePerformanceChange}
                  className="w-2/6 p-3 border border-gray-300 rounded-lg "
                >
                  <option value="">Select Performance Rating</option>
                  {performanceOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
      
                <div className="flex gap-6">
                <div className="w-1/2">
                  <h2 className="text-md font-medium text-gray-600 my-4">Areas of Growth</h2>
                  <textarea
                    value={areasOfGrowth}
                    onChange={handleareasOfGrowth}
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] resize-none"
                    placeholder="Enter Areas of Growth"
                  />
                </div>

                <div className="w-1/2">
                  <h2 className="text-md font-medium text-gray-600 my-4">Employee Performance Summary</h2>
                  <textarea
                    value={summary}
                    onChange={handlesummary}
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] resize-none"
                    placeholder="Enter Performance Summary"
                  />
                </div>
              </div>

              </div>
            </div>
          </>
        ) : (
          <div />
        )}
      </div>

      <div className="space-y-4 mx-2 rounded-lg">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 ">
        <div className="flex items-center mb-4 border-b ">
        <CircleChevronDown className="text-cyan-800 mr-2 "/>
          <h2 className="text-xl font-semibold text-cyan-800 my-2 mt-3 pb-2 flex items-center gap-2">
            Performance Evaluation Breakdown
          </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Assessment Category
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Weightage
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                    Attainment
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4 border text-gray-800 font-medium">
                      {row.category}
                    </td>
                    <td className="p-4 border text-gray-600">
                      {row.weightage}
                    </td>
                    <td className="p-4 border text-gray-600">
                      <span
                        className={`
                        px-3 py-1 rounded-lg text-sm font-semibold
                      ${getAttainmentStyle(row.attainment)}`} >
                        {row.attainment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       
        {empType === "HR" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-10">
            <label
              htmlFor="file-upload"
              className="text-xl font-semibold text-cyan-800 mb-4 border-b pb-2 flex items-center"
            >
              Upload file
            </label>
            <div className="overflow-x-auto">
              <input
                type="file"
                id="file-upload"
                name="file-upload"
                className="block w-full text-sm text-gray-800 file:border file:border-gray-300 file:bg-gray-100 file:px-12 file:py-2 file:rounded-md hover:file:bg-gray-200"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                onChange={handleFileChange}
              />

              {fileName ? (
                <div className="flex items-center border-gray-300 pt-2">
                  <div className="text-gray-800 text-sm">
                    {fileName.name}
                  </div>
                </div>
              ) : documentName ? (
                <div className="flex items-center border-gray-300 pt-2">
                  <div className="text-gray-800 text-sm">
                    {documentName}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">-</div>
              )}
            </div>
          </div>
        )}

        <div className=" sticky flex justify-end">
          <div className="mr-auto">
            <button
              type="button"
              className="px-6 py-2 text-blue-600 border border-blue-600 bg-white rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>

          <div className="mr-2">
            <button
              type="button"
              className="px-6 py-2 text-white bg-orange-500 rounded-lg"
              onClick={

                handleSaveAndExit
              }
            >

              Save & Exit
            </button>
          </div>

          <div>
            <button
              className={`px-6 py-2 text-white bg-blue-600 rounded-lg`}
              onClick={() => setIsModalOpen(true)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Submit Appraisal
              </h2>

              <p className="mt-3 text-gray-600 text-center">
                Are you sure you want to submit this appraisal?
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Appraisal Submission Confirmation
              </h2>
              {userData ? (

              <p className="my-3 text-gray-600 text-center">
                You have successfully reviewed the appraisal for {userData.empName}.
              </p>
              ):(<div/>)}
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded w-3/4"
                  onClick={closeThankYouModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationSummary;