import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Briefcase, TrendingUp } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const CEvaluationSummary = () => {
  const [userData, setUserData] = useState(null)
  const location = useLocation();
  const { timePeriod } = location.state || {};
  const { employeeId } = useParams();
  const [performanceRating, setPerformanceRating] = useState('');
  const [areasOfGrowth,setareasOfGrowth] = useState('');
  const [summary,setsummary] = useState('');
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [documentName, setDocumentName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  const empType = localStorage.getItem("empType");
  const [overallWeightage, setOverallWeightage] = useState('N/A');
  

 

  const [tableData, setTableData] = useState([
    {
      id: 1,
      category: "Employee Self Appraisal",
      weightage: "10%",
      attainment: "",
    },
    {
      id: 2,
      category: "Manager Assessment",
      weightage: "30%",
      attainment: "",
    },
    {
      id: 3,
      category: "Employee Goals",
      weightage: "35%",
      attainment: "",
    },
    {
      id: 4,
      category: "Additional Areas of Assessment",
      weightage: "25%",
      attainment: "",
    },

    {
      id: 5,
      category: "Overall Weightage",
      weightage: "100%",
      attainment: "",
    },
  ]);

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
          const managerRating = parseFloat(evaluationData.managerRating || 0);
          const goalWeight = parseFloat(evaluationData.goalsOverAll || 0);
          const additionalAreasOverall = parseFloat(evaluationData.additionalAreasOverall || 0);
          const overallWeightage = selfAssessment + additionalAreasOverall + managerRating + goalWeight;
          if (evaluationData.performanceRating) {
            setPerformanceRating(evaluationData.performanceRating);
          }
          if (evaluationData.areasOfGrowth) {
            setareasOfGrowth(evaluationData.areasOfGrowth);
          }
          if (evaluationData.summary) {
            setsummary(evaluationData.summary)
          }
  
          setOverallWeightage(overallWeightage.toFixed(2) || 'N/A');

          const updatedTableData = [
            {
              id: 1,
              category: "Employee Self Appraisal",
              weightage: "10%",
              attainment: evaluationData.selfAssesment || "N/A",
            },
            {
              id: 2,
              category: "Manager Assessment",
              weightage: "30%",
              attainment: evaluationData.managerRating || "N/A",
            },
            {
              id: 3,
              category: "Employee Goals",
              weightage: "35%",
              attainment: evaluationData.goalsOverAll || "N/A",
            },
            {
              id: 4,
              category: "Additional Areas of Assessment",
              weightage: "25%",
              attainment: evaluationData.additionalAreasOverall || "N/A",
            },

            {
              id: 5,
              category: "Overall Weightage",
              weightage: "100%",
              attainment: overallWeightage.toFixed(2),
            },
          ];

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
    navigate(`/CE2/${employeeId}`, { state: { timePeriod } });
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  
const handleReturntoDashboard = () =>{
  navigate('/manager-my-performance')
}


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
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="mb-2">
        <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Overall Feedback</h1>

            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-50 text-cyan-800 px-3 py-2 font-medium rounded">
                {new Date(timePeriod[0]).toISOString().slice(0, 10)} to{" "}
                {new Date(timePeriod[1]).toISOString().slice(0, 10)}
              </span>
            </div>

            <div />

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
                <h2 className="text-xl font-semibold text-cyan-800 mb-4">Performance Rating</h2>
               {performanceRating}
                  
      
                {/* <h2 className="text-xl font-semibold text-cyan-800 mt-6 mb-4">Areas of Growth</h2>
         {areasOfGrowth} */}

<div className="flex gap-6">
  <div className="w-1/2">
    <h2 className="text-xl font-semibold text-cyan-800 mt-6 mb-4">Areas of Growth</h2>
   {areasOfGrowth}
  </div>

  <div className="w-1/2">
    <h2 className="text-xl font-semibold text-cyan-800 mt-6 mb-4">Employee Performance Summary</h2>
   {summary}
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
          <h2 className="text-xl font-semibold text-cyan-800 mb-6 border-b pb-2 flex items-center gap-2">
            Performance Evaluation Breakdown
          </h2>
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
                        ${row.attainment === "N/A"
                            ? "bg-gray-100 text-gray-600"
                            : parseFloat(row.attainment) >= 80
                              ? "bg-green-100 text-green-800"
                              : parseFloat(row.attainment) >= 50
                                ? "bg-red-100 text-red-800 "
                                : "bg-yellow-100 text-yellow-800"
                          }
                      `}
                      >
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
              className="px-6 py-2 text-cyan-800 border border-cyan-800 bg-white rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>

        

          <div>
            <button
              className={`px-6 py-2 text-white bg-cyan-800 rounded-lg`}
              onClick={handleReturntoDashboard}
            >
             handleReturntoDashboard
            </button>
          </div>
        </div>
      </div>

     
     
    </div>
  );
};

export default CEvaluationSummary;