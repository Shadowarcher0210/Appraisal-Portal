import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { User, Briefcase, TrendingUp, Target, Award, ChevronRight, Users, BarChart, Calendar } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const EvaluationView1 = () => {
    const [showHelpPopup, setShowHelpPopup] = useState(false);
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { employeeId } = useParams();
    const currentYear = new Date().getFullYear() ;
    const location = useLocation();
    const { timePeriod } = location.state || {};
    const [employeeGoals, setEmployeeGoals] = useState([]);
    const categoryIcons = {
        development: <Target className="w-5 h-5" />,
        leadership: <Users className="w-5 h-5" />,
        technical: <BarChart className="w-5 h-5" />,
        'soft-skills': <Award className="w-5 h-5" />
    };

    const [managerWeightages, setManagerWeightages] = useState({});

    useEffect(() => {
        const initialWeightages = employeeGoals.reduce((acc, goal) => {
            acc[goal._id] = "";
            return acc;
        }, {});
        setManagerWeightages(initialWeightages);
    }, [employeeGoals]);


    const handleWeightageChange = (goalId, value) => {
        setManagerWeightages(prev => ({
            ...prev,
            [goalId]: value
        }));
    };

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

    const handleBack = () => {
        navigate(`/evaluationView/${employeeId}`,{state:{timePeriod}});
    };

    const handleContinue = () => {
        navigate(`/evaluationView2/${employeeId}`,{state:{timePeriod}}); 
      }

   

    useEffect(() => {
        const fetchEmployeeGoals = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/goals/${employeeId}`);
                setEmployeeGoals(response.data.data || []);
                console.log("goals", response.data)

                setLoading(false);
            } catch (err) {
                console.error('Error fetching goals:', err);
                // setError('Error fetching employee goals');
                setLoading(false);
            }
        };

        fetchEmployeeGoals();
    }, []);

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
                    pageData: questionsAndAnswers.map((qa, index) => ({
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


    const handleManagerEvaluationChange = (e, index) => {
        if (!formData || !formData[0]) return;

        const updatedFormData = [...formData];
        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);

        if (!updatedFormData[0].pageData[index].managerEvaluation) {
            updatedFormData[0].pageData[index].managerEvaluation = {};
        }

        updatedFormData[0].pageData[index].managerEvaluation = value;
        setFormData(updatedFormData);
    };

    //   const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const handleSubmit = async () => {
        if (!formData || !formData[0] || !formData[0].pageData) return;

        try {
            const email2 = { email }
            console.log("email", email2);

            // const email3 = formData[0]?.email || "default-email@example.com"; // Replace this with the actual email
            console.log("Submitting form with employeeId:", employeeId, "and email:", email);

            const submissionData = {
                pageData: formData[0].pageData.map(item => ({
                    questionId: item.questionId,
                    answer: item.answer || '',
                    notes: item.notes || '',
                    weights: item.weights || '',
                    managerEvaluation: item.managerEvaluation || 0

                }))
            };


            await axios.put(
                `http://localhost:3003/form/saveDetails/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
                submissionData,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("PUT request successful.");

            await axios.post(
                "http://localhost:3003/confirmationEmail/completedEmail",
                { userId: employeeId, email: email },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("POST request for confirmation email successful.");

            setIsModalVisible(true);
        } catch (error) {
            console.error("Error submitting evaluation:", error.response ? error.response.data : error.message);
            setError("Error submitting evaluation");
        }
    };


    

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

    const getStatusColor = (deadline) => {
        const daysRemaining = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) return "bg-red-100 text-red-700";
        if (daysRemaining < 7) return "bg-amber-100 text-amber-700";
        return "bg-emerald-100 text-emerald-700";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 w-full ">

            <div className="mb-2">

                <div className="bg-cyan-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-1 mt-14 mx-2">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Employee Goals for {previousYear}-{currentYear}</h1>
                        {formData ? (

                            <div className="flex items-center gap-2">
                                <span className="text-sm bg-blue-50 text-cyan-800  px-3 py-2 font-medium rounded">
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

                <div className="mx-2 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Development Goals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {employeeGoals.map((goal, index) => (
                            <div
                                key={goal._id}
                                className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:scale-[1.02]"
                            >
                                {/* Header Section */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            {categoryIcons[goal.category]}
                                        </div>
                                        <span className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
                                            {goal.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                                    {goal.description}
                                </h4>

                                {/* Footer Section */}
                                <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                                    <div className="flex items-center space-x-2">
                                        <BarChart className="w-5 h-5 text-fuchsia-500" />
                                        <span className="text-sm font-semibold text-gray-700">
                                            Weight: {goal.weightage}%
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-fuchsia-500" />
                                        <span className="text-sm text-gray-600">
                                            Due: {new Date(goal.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <br></br>
                                <hr></hr>
                                <br></br>
                                <div>
                                    <div className='-mb-2'>
                                        <h className="font-bold ">Managers Review</h>
                                    </div>
                                    <br></br>
                                    <div>
                                        <div className="flex items-center gap-4 w-full">
                                            <label className="text-sm font-medium text-gray-700 -mt-4">Weight (%)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    className="w-32 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                                    value={managerWeightages[goal._id]}
                                                    onChange={(e) => handleWeightageChange(goal._id, e.target.value)}
                                                    onBlur={(e) => {
                                                        // On blur, if the field is empty, set it to 0
                                                        if (e.target.value === '') {
                                                            handleWeightageChange(goal._id, '0');
                                                        }
                                                    }}
                                                    min="0"
                                                    max={goal.weightage}
                                                    placeholder={`Max ${goal.weightage}%`}
                                                />
                                                {Number(managerWeightages[goal._id]) > goal.weightage && (
                                                    <div className="absolute -bottom-4 left-0 text-red-500 text-xs ">
                                                        Cannot exceed {goal.weightage}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 -mt-4">
                                                Maximum allowed: {goal.weightage}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="mt-6 flex justify-end">
          <div className='mr-auto'>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
          <div className='mr-4'>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>

          <div>
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

                {isModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-86 transform transition-all">
                            <div className="p-6">


                                <p className="mt-3 text-gray-600 text-center">
                                    Thank you for submitting
                                </p>
                                <div className="mt-6 flex justify-center space-x-4">
                                    <button
                                        className="px-4 py-2 w-1/2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                        onClick={() => handleBack()}
                                    >
                                        back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </div>

        </div>
    );
};

export default EvaluationView1;