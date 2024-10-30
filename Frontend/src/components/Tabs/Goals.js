import {React,useState, useEffect} from 'react';
import axios from 'axios'
import {  User, Briefcase, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';

const Goals = ({
  goalsResponse,
  goalAnswers,
  handleGoalChange,
  handlePreviousForm,
  handleSubmit,
}) => {
  const [formData, setFormData] = useState(null);

  const employeeId = localStorage.getItem('employeeId');

  useEffect(()=>{
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
     },[])
  return (
    <div className="relative h-full flex flex-col overflow-y-auto scrollbar-thin">
      {/* Header Section */}
      <div className="bg-blue-600 text-white mb-3 p-4 rounded-lg  shadow-lg mt-10 ">
        <h1 className="text-2xl font-bold ">Annual Performance Self-Assessment</h1>
      </div>
      <div className="mb-6">
 {formData ? (

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4   ">
    {/* Employee Name Card */}
    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
      <div className="p-3 bg-blue-100 rounded-lg shrink-0">
        <User className="text-blue-600" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Employee Name</p>
        <p className="font-medium text-gray-900">{formData.user.empName}</p>
      </div>
    </div>

    {/* Designation Card */}
    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
      <div className="p-3 bg-purple-100 rounded-lg shrink-0">
        <Briefcase className="text-purple-600" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Designation</p>
        <p className="font-medium text-gray-900">{formData.user.designation}</p>
      </div>
    </div>

    {/* Manager Name Card */}
    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
      <div className="p-3 bg-green-100 rounded-lg shrink-0">
        <User className="text-green-600" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Manager Name</p>
        <p className="font-medium text-gray-900">{formData.user.managerName}</p>
      </div>
    </div>

    {/* Evaluation Status Card */}
    <div className="flex items-start gap-4 p-4 rounded-md shadow-md bg-white">
      <div className="p-3 bg-orange-100 rounded-lg shrink-0">
        <TrendingUp className="text-orange-600" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Manager's Evaluation</p>
        <p className="font-medium text-gray-900">In Progress</p>
      </div>
    </div>
  </div>):(<div/>)}
</div>

      <div className="px-1 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Goals Setting</h2>
              <p className="text-gray-600">Please define your professional goals for the upcoming assessment year.</p>
            </div>
          </div>

          <div className="space-y-6">
            {goalsResponse.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                </div>
                <textarea
                  className="w-full min-h-32 border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Describe your goal in detail."
                  value={goalAnswers[index]?.answer || ''}      
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                ></textarea>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-between space-x-4 border-t px-6 py-4">
      <button
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          onClick={handlePreviousForm}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div> 

    </div>
  );
};

export default Goals;