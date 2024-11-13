import axios from 'axios';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const M_Performance = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [academicYears, setAcademicYears] = useState([]);
    const [appraisals, setAppraisals] = useState([]);
    const navigate = useNavigate();

    const managerName = localStorage.getItem('empName');

    // Generate academic years and set default selected year
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const years = [];

        for (let i = startYear; i <= currentYear; i++) {
            years.push(`${i}-${i + 1}`);
        }
        setAcademicYears(years);

        const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
        setSelectedYear(`${defaultYear}-${defaultYear + 1}`);
    }, []);

    // Fetch appraisals when selected year changes


    const fetchAllAppraisalDetails = async () => {
        const [yearStart] = selectedYear.split('-');
        const startDate = `${yearStart}-04-01`;
        const endDate = `${parseInt(yearStart) + 1}-03-31`;

        try {
            const response = await axios.get(
               ` http://localhost:3003/appraisal/allAppraisals/${managerName}/${startDate}/${endDate}`
            );
            console.log('Fetched Appraisals in Performance Page:', response.data);
            const allAppraisals = response.data.data
            const sortedAppraisals = allAppraisals.sort((a, b) => {
                if (a.status === "Submitted" || a.status === "Under Review") {
                    return -1; // Move to the top
                }
                if (b.status === "Submitted" || b.status === "Under Review") {
                    return 1; // Move to the top
                }
                return 0; // No change
            });
            setAppraisals(allAppraisals);
            console.log("empname", allAppraisals)
        } catch (error) {
            console.error('Error fetching appraisals in Performance page:', error);
        }
    };


    useEffect(() => {
        if (selectedYear && managerName) {
            fetchAllAppraisalDetails();
        }
    }, [selectedYear]);
    
    // const handleViewClick = (appraisal) => {
    //     const { employeeId, timePeriod } = appraisal;
    //     console.log('Employee Id :',employeeId)
    //     navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
    // };

    const handleViewClick = async (appraisal) => {
        const { employeeId, timePeriod, status } = appraisal;

        // If the status is "Submitted", update it to "Under Review"
        if (status === "Submitted") {
            try {
                const response = await axios.put(
                    `http://localhost:3003/form/status/${employeeId}/${timePeriod[0]}/${timePeriod[1]}`,
                    { status: "Under Review" }
                );

                if (response.status === 200) {
                    console.log('Status updated to Under Review:', response.data);
                    fetchAllAppraisalDetails(); // Refresh the list after status update
                } else {
                    console.error('Failed to update status:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating status to Under Review:', error);
            }
        }

        if (status === "Submitted" || status === "Under Review") {
           
            navigate(`/evaluationView/${employeeId}`, { state: { timePeriod } });
        } else if (status === "Completed") {
            // Navigate to employee view if status is "Completed"
            navigate(`/empview/${employeeId}`, { state: { timePeriod } });
        }
    };

 
    useEffect(() => {
        console.log('Updated appraisals:', appraisals);
    }, [appraisals]);

    const formatDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

    return (
        <div className="justify-center items-start mt-20 ml-6">
            <div>
                <label className='ml-2 text-3xl font-bold text-orange-600'>Performance Insights</label>
                <p className='ml-4 mt-3 text-gray-800 font-medium'>Key metrics and trends to guide your Team progress.</p>
            </div>

            <div className='mt-2 ml-2'>
                <label className='border-black border-1 rounded-full py-1 px-9 bg-slate-100'>
                    <label htmlFor="time-period">Time Period:</label>
                    <select
                        id="time-period"
                        value={selectedYear || ''}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >

                        {academicYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex-1 p-2 mt-5 overflow-hidden max-h-full">
                <div className="w-12/12 p-3 bg-white border shadow-md rounded-md ml-2 mr-8">
                    <h2 className="text-2xl font-bold text-white bg-cyan-800 p-2 rounded mb-4">Preceding Appraisals</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reporting Manager</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appraisals.length > 0 ? (
                                appraisals.map((appraisal, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                            {appraisal.empName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                            {appraisal.timePeriod ? `${formatDate(appraisal.timePeriod[0])} to ${formatDate(appraisal.timePeriod[1])}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
                                            {appraisal.managerName}
                                        </td>
                                        <td className="px-6 py-4  whitespace-nowrap">
                                            <span className='inline-flex items-center  py-1.5 px-2 rounded-lg text-sm font-medium text-green-800 bg-cyan-100'>{appraisal.status}</span>
                                            
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-blue-700 cursor-pointer">
                                        <button
                                                className={`bg-cyan-800 text-white hover:bg-cyan-700 rounded-md px-2 py-2 w-16 ${appraisal.status === "Completed" ? '' : 'cursor-pointer'}`}
                                                onClick={() => handleViewClick(appraisal)}
                                            >
                                                {appraisal.status === "Completed" ? "View" : "Review"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-900">
                                        No appraisals found for this user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default M_Performance;