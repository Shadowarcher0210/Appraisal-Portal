import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const M_Performance = () => {
    const [selectedYear, setSelectedYear] = useState(null);
   const [appraisals, setAppraisals] = useState(null);
    const [expandedSection, setExpandedSection] = useState('manager');

    const employeeName = localStorage.getItem('empName');
    const navigate = useNavigate();
    //   const menuRef = useRef();


    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;


    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

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

    useEffect(() => {
        if (selectedYear) {
            fetchAppraisalDetails(selectedYear);
        }
    }, [selectedYear]);
    const handleCloseMenu = () => {
    };
const fetchAppraisalDetails = async () => {
        const employeeId = localStorage.getItem('employeeId');
        if (employeeId) {
            try {
                const response = await axios.get(`http://localhost:3003/form/performance/${employeeId}`)
                setAppraisals(response.data);
                console.log('Fetched Appraisals in Performance Page :', response.data);
            } catch (error) {
                console.error('Error fetching appraisals in Performance page :', error)
            }
        }

    }


    const handleViewClick = (appraisal) => {
        console.log("Navigating to view");
        const { employeeId, timePeriod } = appraisal;
        navigate(`/empview?${employeeId}&${timePeriod[0]}&${timePeriod[1]}`, { state: { timePeriod } });
        handleCloseMenu();
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-00 uppercase tracking-wider">Employee name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Assessment Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Initiated On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appraisals && appraisals.length > 0 ? (
                                    appraisals.map((appraisal, index) => (
                                        <tr key={appraisal.employeeId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-gray-500">
                                                {employeeName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                {formatDate(appraisal.timePeriod[0])} to {formatDate(appraisal.timePeriod[1])}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{formatDate(appraisal.timePeriod[0])}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium  text-gray-500">
                                                {appraisal.managerName}
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-gray-500"> */}
                                            <td className="px-6 py-2 mt-4 inline-flex text-sm font-semibold rounded-lg bg-green-100 text-green-700">

                                                {appraisal.status}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-sm  text-blue-900 hover:text-blue-700 cursor-pointer">
                                                <button className='bg-blue-600 text-white hover:bg-blue-600 rounded-md px-2 py-2 w-16' onClick={() => handleViewClick(appraisal)}>View</button>
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
    )
}

export default M_Performance