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
                `http://localhost:3003/appraisal/allAppraisals/${managerName}/${startDate}/${endDate}`
            );
            console.log('Fetched Appraisals in Performance Page:', response.data);
            const allAppraisals = response.data.data
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
    const handleViewClick = (appraisal) => {
        const { employeeId, timePeriod } = appraisal;
        navigate(`/manager-View?${employeeId}&${timePeriod[0]}&${timePeriod[1]}`, { state: { timePeriod } });
    };
    useEffect(() => {
        console.log('Updated appraisals:', appraisals);
    }, [appraisals]);

    const formatDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

    return (
        <div className="justify-center items-start mt-20 ml-6">
            <div>
                <label className='ml-2 text-3xl font-bold text-orange-600'>Performance Insights of your Team</label>
                <p className='ml-2 mt-3 text-gray-500 font-medium'>Key metrics and trends to guide your Team progress.</p>
            </div>

            <div className='mt-6 ml-2 w-48'>
                <label className='block text-gray-700 font-semibold mb-2'>
                    Time Period:
                </label>
                <div className='relative'>
                    <select
                    id="time-period"
                    value={selectedYear || ''}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-cyan-800 focus:border-cyan-800 bg-white text-gray-700 text-lg'
                    >
                    {academicYears.map((year) => (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    ))}
                    </select>
                   
                </div>
                </div>


            <div className="flex-1 p-1 mt-5 overflow-hidden max-h-full">
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
                                        <td className="px-6 py-2 mt-4 inline-flex text-sm font-semibold rounded-lg bg-green-100 text-green-700">
                                        {appraisal.status}
                                            
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-blue-700 cursor-pointer">
                                            <button
                                                className="bg-cyan-800 text-white hover:bg-blue-600 rounded-md px-2 py-2 w-16"
                                                onClick={() => handleViewClick(appraisal)}
                                            >
                                                View
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
