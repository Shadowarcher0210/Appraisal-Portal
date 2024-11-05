import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const M_Performance = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [appraisals, setAppraisals] = useState(null);
    const managerName = localStorage.getItem('managerName');
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-04-01`;
    const endDate = `${currentYear + 1}-03-31`;

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3;
        const years = [];

        for (let i = startYear; i <= currentYear; i++) {
            years.push(`${i}-${i + 1}`);
        }

        const defaultYear = currentYear - (new Date().getMonth() < 3 ? 1 : 0);
        setSelectedYear(`${defaultYear}-${defaultYear + 1}`);
    }, []);

    const fetchAllAppraisalDetails = useCallback(async () => {
        if (managerName) {
            try {
                const response = await axios.get(`http://localhost:3003/appraisal/allAppraisals/${managerName}/${startDate}/${endDate}`);
                const sortedAppraisals = response.data.data.sort((a, b) => {
                    if (a.status === 'Submitted' && b.status !== 'Submitted') return -1;
                    if (a.status !== 'Submitted' && b.status === 'Submitted') return 1;
                    return 0;
                });
                setAppraisals(sortedAppraisals);
                console.log('Fetched and sorted appraisals in Performance Page:', sortedAppraisals);
            } catch (error) {
                console.error('Error fetching appraisals in Performance page:', error);
            }
        }
    }, [managerName, startDate, endDate]);
    

    useEffect(() => {
        if (selectedYear) {
            fetchAllAppraisalDetails();
        }
    }, [selectedYear, fetchAllAppraisalDetails]);

    const handleViewClick = (appraisal) => {
        const { employeeId, timePeriod } = appraisal;
        navigate(`/empview?${employeeId}&${timePeriod[0]}&${timePeriod[1]}`, { state: { timePeriod } });
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="justify-center items-start mt-20 ml-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reporting authority</th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appraisals && appraisals.length > 0 ? (
                        appraisals.map((appraisal) => (
                            <tr key={appraisal._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                    {appraisal.empName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                    {formatDate(appraisal.timePeriod[0])} to {formatDate(appraisal.timePeriod[1])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-500">
                                    {appraisal.managerName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-blue-900 hover:text-gray-700 cursor-pointer">
                                    <button
                                        className={`${appraisal.status === 'Submitted' ? 'bg-green-600' : 'bg-green-600'
                                            } text-white hover:bg-green-700 rounded-md px-2 py-2 w-16`}
                                        onClick={() => handleViewClick(appraisal)}
                                    >
                                        {appraisal.status === 'Submitted' ? 'Review' : 'View'}
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
    );
};

export default M_Performance;
