const Appraisal = require('../models/Appraisal');
const Employee = require('../models/User')
const express = require('express');
const bodyParser = require('body-parser');
const Goals = require('../models/Goals');
const app = express()
app.use(bodyParser.json())
// const saveAppraisalDetails = async (req, res) => {
//     const { employeeId, startDate, endDate } = req.params;
//     const { pageData } = req.body;
//     const isExit = req.query.isExit === 'true';
//     try {
//         if (!employeeId) {
//             return res.status(400).send({ error: 'User ID is required' });
//         }

//         const isValidDate = (date) => !isNaN(new Date(date).getTime());
//         if (!isValidDate(startDate) || !isValidDate(endDate)) {
//             return res.status(400).send({ error: 'Invalid date format.' });
//         }

//         const user = await Employee.findOne({ employeeId: employeeId }, { empName: 1 });
//         if (!user) {
//             return res.status(404).send({ error: 'User not found' });
//         }

//         const timePeriod = [new Date(startDate), new Date(endDate)];
//         const newStatus = isExit ? 'In Progress' : 'Submitted';

//         const updateFields = { pageData, status: newStatus };
//         if (newStatus === 'Submitted') {
//             const currentDate = new Date();
//             const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
//             updateFields.submittedDate = formattedDate;
//         }

//         const updatedAppraisal = await Appraisal.findOneAndUpdate(
//             {
//                 employeeId: employeeId,
//                 timePeriod: { $all: timePeriod },
//             },
//             updateFields,
//             { new: true }
//         );

//         if (!updatedAppraisal) {
//             return res.status(404).json({ message: 'Appraisal form not found.' });
//         }

//         res.status(201).send({
//             message: 'Appraisal form saved successfully!',
//             data: updatedAppraisal,
//         });
//     } catch (error) {
//         console.log('Error saving appraisal form', error);
//         res.status(500).send({
//             success: false,
//             error: error.message
//         });
//     }
// };
const saveAppraisalDetails = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;
    const { pageData, overallScore } = req.body;

    const isExit = req.query.isExit === 'true';

    try {
        if (!employeeId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        if (!pageData || !Array.isArray(pageData)) {
            return res.status(400).send({
                error: 'Page data is required and must be an array'
            });
        }

        for (const question of pageData) {
            if (!question.questionId || typeof question.answer !== 'string') {
                return res.status(400).send({
                    error: 'Each page data item must have questionId and answer'
                });
            }

            if (question.managerEvaluation && (typeof question.managerEvaluation !== 'number')) {
                return res.status(400).send({
                    error: 'Each manager evaluation must have a percentage'
                });
            }
        }

        const isValidDate = (date) => !isNaN(new Date(date).getTime());
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).send({ error: 'Invalid date format.' });
        }

        const user = await Employee.findOne({ employeeId: employeeId }, { empName: 1 });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const timePeriod = [new Date(startDate), new Date(endDate)];

        const existingAppraisal = await Appraisal.findOne({
            employeeId: employeeId,
            timePeriod: { $all: timePeriod }
        });

        let newStatus = existingAppraisal ? existingAppraisal.status : null;
        if (existingAppraisal && existingAppraisal.status === 'Under HR Review') {
            newStatus = existingAppraisal.status; 
        } else {
            const hasManagerEvaluation = pageData.some(question => question.managerEvaluation);
            newStatus = hasManagerEvaluation ? 'Under Review' : (isExit ? 'In Progress' : 'Submitted');
        }

        const updatedPageData = pageData.map(question => {
            if (question.managerEvaluation) {
                delete question.managerEvaluation.weightedScore;
            }
            return question;
        });

        const updatedAppraisal = await Appraisal.findOneAndUpdate(
            {
                employeeId: employeeId,
                timePeriod: { $all: timePeriod },
            },
            {
                pageData: updatedPageData,
                status: newStatus,  
                overallScore,
                lastModified: new Date()
            },
            { new: true }
        );

        if (!updatedAppraisal) {
            return res.status(404).json({ message: 'Appraisal form not found.' });
        }

        res.status(201).send({
            message: 'Appraisal form saved successfully!',
            data: updatedAppraisal
        });
    } catch (error) {
        console.log('Error saving appraisal form', error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

const updateAppraisalStatus = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;
    const { status } = req.body;

    try {
        if (!employeeId) {
            return res.status(400).send({ error: "employeeId is required" });
        }

        if (!startDate || !endDate) {
            return res.status(400).send({ error: "A valid start and end date are required." });
        }

        const timePeriod = [new Date(startDate), new Date(endDate)];

        const validStatuses = ["To Do", "In Progress", "Submitted", "Under Review", "Under HR Review","Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ error: "Invalid status value provided" });
        }

        const appraisal = await Appraisal.findOneAndUpdate(
            {
                employeeId: employeeId,
                timePeriod: { $all: timePeriod },
            },
            { status: status },
            {
                new: true,
                fields: {
                    _id: 0,
                    timePeriod: 1,
                    initiatedOn: 1,
                    managerName: 1,
                    depName: 1,
                    empScore: 1,
                    status: 1,
                },
            }
        );

        if (!appraisal) {
            return res.status(404).json({
                message: "Appraisal not found for this employee and time period.",
            });
        }

        res.status(200).json({
            message: "Appraisal status updated successfully!",
            status: appraisal.status,
            timePeriod: appraisal.timePeriod,
            initiatedOn: appraisal.initiatedOn,
            managerName: appraisal.managerName,
            depName: appraisal.department,
            empScore: appraisal.empScore,
            pageData: appraisal.pageData,
        });
    } catch (error) {
        console.error("Error updating appraisal status:", error);
        res.status(500).send({ error: "Error updating appraisal status" });
    }
};

const getAppraisals = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const appraisals = await Appraisal.find({ employeeId: employeeId }, { timePeriod: 1, initiatedOn: 1, designation: 1, department: 1, managerName: 1, empScore: 1, status: 1, _id: 0 });
        const user = await Employee.findOne({ employeeId: employeeId }, { empName: 1 });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
       
        if (appraisals.length === 0) {
            return res.status(404).json({ message: 'No appraisals found for this employee.' });
        }

        const isValidDate = (date) => {
            return date instanceof Date && !isNaN(date);
        };

        const formatDateOnly = (date) => {
            if (isValidDate(date)) {
                return date.toISOString().split('T')[0];
            }
            return null;
        };

        const responseData = appraisals.map(appraisal => ({
            empName: user.empName,
            timePeriod: Array.isArray(appraisal.timePeriod) ? appraisal.timePeriod.map(formatDateOnly) : [],
            initiatedOn: appraisal.initiatedOn ? formatDateOnly(new Date(appraisal.initiatedOn)) : null,
            designation: appraisal.designation,
            managerName: appraisal.managerName,
            depName: appraisal.department,
            empScore: appraisal.empScore,
            status: appraisal.status,
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).send('Error fetching appraisal data');
    }
};
const getAppraisalAnswers = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;
    try {

        const start = new Date(startDate).toISOString().split('T')[0]
        const end = new Date(endDate).toISOString().split('T')[0]

        const appraisalAnswers = await Appraisal.find(
            {
                employeeId: employeeId,
                "timePeriod.0": { $gte: start },
                "timePeriod.1": { $lte: end },
            },
            { pageData: 1, timePeriod: 1, empName: 1, designation: 1, department: 1, band: 1, managerName: 1, status: 1 });


        console.log('Retrieved Appraisals Answers:', appraisalAnswers);


        if (appraisalAnswers.length === 0) {
            return res.status(404).json({ message: 'No appraisals found for this employee.' });
        }
        const responseData = appraisalAnswers.map(appraisal => ({
            employeeId,
            empName: appraisal.empName,
            designation: appraisal.designation,
            department: appraisal.department,
            band: appraisal.band,
            timePeriod: appraisal.timePeriod,
            managerName: appraisal.managerName,
            status: appraisal.status,
            pageData: appraisal.pageData

        }));
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).send('Error fetching appraisal data');
    }
};

const getEmployeeAppraisal = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const statuses = ['Submitted', 'Under Review', 'Under HR Review', 'Completed'];
        const appraisals = await Appraisal.find({
            employeeId,
            status: { $in: statuses },

        });
        if (!appraisals.length) {
            return res.status(404).json({ message: 'No appraisals found.' });
        }

        res.status(200).json(appraisals);
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

const createAppraisalForm = async (req, res) => {
    try {
        const { employeeId, timePeriod } = req.body;

        if (!employeeId || !timePeriod) {
            return res.status(400).json({ message: 'Both employeeId(s) and timePeriod must be provided.' });
        }

        const employeeIds = Array.isArray(employeeId) ? employeeId : [employeeId];

        if (!timePeriod) {
            return res.status(400).json({ message: 'Time period is required.' });
        }

        const appraisalPromises = employeeIds.map(async (empId) => {
            const employee = await Employee.findOne({ employeeId: empId });

            if (!employee) {
                return { employeeId: empId, message: 'Employee not found.' };
            }

            const existingAppraisal = await Appraisal.findOne({
                employeeId: empId,
                timePeriod: timePeriod,
            });

            if (existingAppraisal) {
                return { employeeId: empId, message: 'An appraisal already exists for this employee in the specified time period.' };
            }

            const newAppraisal = new Appraisal({
                employeeId: empId,
                empName: employee.empName,
                designation: employee.designation,
                department: employee.department,
                band: employee.band,
                timePeriod,
                initiatedOn: new Date(),
                managerName: employee.managerName,
                status: 'To Do',
                pageData: [],
            });

            const savedAppraisal = await newAppraisal.save();
            return { employeeId: empId, message: 'Appraisal created successfully', data: savedAppraisal };
        });

        const results = await Promise.all(appraisalPromises);

        return res.status(201).json({
            message: 'Appraisals processed',
            data: results,
        });

    } catch (error) {
        console.error('Error in creating appraisal form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAppraisalForm = async (req, res) => {
    try {
        const { employeeId, timePeriod } = req.body;

        if (!employeeId || !timePeriod) {
            return res.status(400).json({ message: 'Both employeeId(s) and timePeriod must be provided.' });
        }

        const employeeIds = Array.isArray(employeeId) ? employeeId : [employeeId];

        const deletionPromises = employeeIds.map(async (empId) => {
            const employee = await Employee.findOne({ employeeId: empId });

            if (!employee) {
                return { employeeId: empId, message: 'Employee not found.' };
            }

            const existingAppraisal = await Appraisal.findOne({
                employeeId: empId,
                timePeriod: timePeriod,
            });

            if (!existingAppraisal) {
                return { employeeId: empId, message: 'No appraisal found for this employee in the specified time period.' };
            }

            await Appraisal.deleteOne({ _id: existingAppraisal._id });

            return { employeeId: empId, message: 'Appraisal deleted successfully' };
        });

        const results = await Promise.all(deletionPromises);

        return res.status(200).json({
            message: 'Appraisals processed for deletion',
            data: results,
        });

    } catch (error) {
        console.error('Error in deleting appraisal form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// const sendExpiringAppraisalNotification = async (req, res) => {
//     const { employeeId, startDate } = req.params;

//     try {
//         const startDateTime = new Date(startDate);
//         if (isNaN(startDateTime.getTime())) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid date format. Please use YYYY-MM-DD format'
//             });
//         }


//         const endDateTime = new Date(startDateTime);
//         endDateTime.setDate(endDateTime.getDate() + 7);


//         startDateTime.setHours(0, 0, 0, 0);
//         endDateTime.setHours(0, 0, 0, 0);

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);


//         const notificationDate = new Date(endDateTime);
//         notificationDate.setDate(notificationDate.getDate() - 7);

//         const query = {
//             employeeId: employeeId,
//             timePeriod: { $exists: true, $size: 2 }
//         };

//         console.log('Checking appraisal for employeeId:', employeeId, 'with start date:', startDate);
//         console.log('Query:', JSON.stringify(query));

//         const appraisal = await Appraisal.findOne(query).select({
//             timePeriod: 1,
//             employeeId: 1,
//             status: 1,
//             empScore: 1,
//             managerName: 1
//         });

//         console.log('Found appraisal:', JSON.stringify(appraisal));

//         if (!appraisal) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No appraisal found for this employee'
//             });
//         }

//         const endDate = new Date(appraisal.timePeriod[1]);

       
//         const oneWeekBefore = new Date(endDate);
//         oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

       

//         let message;
//         let notificationStatus;

//         if (today >= oneWeekBefore) {
//             message = `Please submit your appraisal before ${endDate.toISOString().split('T')[0]} `;
//         } 

//         return res.status(200).json({
//             success: true,
//             data: {
//                 employeeId,
//                 status: notificationStatus,
//                 message
//             }
//         });

//     } catch (error) {
//         console.error('Error checking appraisal expiration:', error);

//         if (error.name === 'CastError') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid user ID format'
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: 'Error checking appraisal expiration',
//             error: error.message
//         });
//     }
// };


const sendExpiringAppraisalNotification = async (req, res) => {
    const { employeeId, startDate } = req.params;

    try {
        const startDateTime = new Date(startDate);
        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please use YYYY-MM-DD format.'
            });
        }

        // Ensure today's date is in the same time zone as the start date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to 00:00 for a clean date comparison (local time)

        // Calculate 7 days after the start date
        const notificationEndDate = new Date(startDateTime);
        notificationEndDate.setDate(notificationEndDate.getDate() + 7); // 7 days after start date
        notificationEndDate.setHours(0, 0, 0, 0); // Set to 00:00 for clean comparison

        const query = {
            employeeId: employeeId,
            timePeriod: { $exists: true, $size: 2 }
        };

        console.log('Checking appraisal for employeeId:', employeeId, 'with start date:', startDate);
        console.log('Query:', JSON.stringify(query));

        const appraisal = await Appraisal.findOne(query).select({
            timePeriod: 1,
            employeeId: 1,
            status: 1,
            empScore: 1,
            managerName: 1
        });

        console.log('Found appraisal:', JSON.stringify(appraisal));

        if (!appraisal) {
            return res.status(404).json({
                success: false,
                message: 'No appraisal found for this employee.'
            });
        }

        const [appraisalStartDate] = appraisal.timePeriod.map(date => new Date(date));
        appraisalStartDate.setHours(0, 0, 0, 0); // Ensure it's set to the start of the day

        console.log('Appraisal Start Date:', appraisalStartDate);
        console.log('Notification End Date (7 days after start date):', notificationEndDate);

        let message;
        // Check if today is within 7 days after the start date and status is "To Do" or "In Progress"
        if (
            today >= appraisalStartDate &&
            today <= notificationEndDate &&
            (appraisal.status === 'To Do' || appraisal.status === 'In Progress')
        ) {
            message = `Please complete your appraisal before ${notificationEndDate.toISOString().split('T')[0]}.`;
        } else {
            console.log('Condition not met. Today:', today, 'Appraisal Start Date:', appraisalStartDate, 'Notification End Date:', notificationEndDate, 'Status:', appraisal.status);
            message = null; // No notification
        }

        return res.status(200).json({
            success: true,
            data: {
                employeeId,
                status: appraisal.status,
                message
            }
        });

    } catch (error) {
        console.error('Error checking appraisal expiration:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error checking appraisal expiration.',
            error: error.message
        });
    }
};

const getApplicationNotification = async (req, res) => {
    try {
        const { employeeId, startDate } = req.params;

        const startDateTime = new Date(startDate);
        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please use YYYY-MM-DD format'
            });
        }


        const appraisal = await Appraisal.findOne({
            employeeId,
            timePeriod: {
                $elemMatch: {
                    $gte: startDateTime
                }
            }
        });

        if (!appraisal) {
            return res.status(404).json({
                success: false,
                message: 'No appraisals found for this user for the specified period.'
            });
        }


        // const endDate = new Date(appraisal.timePeriod[1]);

        const currentDate = new Date().toLocaleDateString();
        const appraisalStartDate = new Date(appraisal.timePeriod[0]);
        const appraisalEndDate = new Date(appraisal.timePeriod[1]);

        const startYear = appraisalStartDate.getFullYear();
        const endYear = appraisalEndDate.getFullYear();

        const formattedStartDate = appraisalStartDate.toISOString().split('T')[0];
        const formattedEndDate = appraisalEndDate.toISOString().split('T')[0];

        if (appraisal.status === 'Submitted') {
            return res.status(200).json({
                success: true,
                message: `Your appraisal for the year ${startYear}-${endYear} has been successfully submitted on ${currentDate}. `,
                employeeId,
            })
        }
        else if (appraisal.status === 'Completed'){
            const managerName = appraisal.managerName || 'the manager';
            return res.status(200).json({
                sucess:true,
                message:`Your performance appraisal for the year ${appraisalStartDate.getFullYear()} to ${appraisalEndDate.getFullYear()} has been reviewed .`,
                employeeId,
            })
        }

        return res.status(200).json({
            success: false,
            currentStatus: appraisal.status,
            period: {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            }
        });
    } catch (error) {
        console.error('Error fetching application notification:', error);
        return res.status(500).json({
            success: false,
            // message: 'Failed to fetch application notification.'
        });
    }
};







const getApplicationNotificationStarts = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const appraisal = await Appraisal.findOne({
            employeeId,
            timePeriod: {
                $elemMatch: {
                    $gte: currentDate,
                }
            }
        });

        if (!appraisal) {
            return res.status(200).json({
                success: true,
                shouldNotify: false,
               
            });
        }

        const appraisalStartDate = new Date(appraisal.timePeriod[0]);
        const appraisalEndDate = new Date(appraisal.timePeriod[1]);

        const timeDifference = appraisalStartDate - currentDate;
        const daysUntilStart = Math.floor(timeDifference / (1000 * 60 * 60 * 24));


        if (daysUntilStart === 30) {
            const formattedStartDate = appraisalStartDate.getFullYear();
            const formattedEndDate = appraisalEndDate.getFullYear();

            const message = `Your appraisal cycle starts in 30 days for the year ${formattedStartDate} to ${formattedEndDate}.`;

            return res.status(200).json({
                message,
            });
        }

        if (daysUntilStart === 10) {
            const formattedStartDate = appraisalStartDate.toISOString().split('T')[0];
            const formattedEndDate = appraisalEndDate.toISOString().split('T')[0];

            const message = `Your appraisal cycle starts in 10 days for the year ${formattedStartDate} to ${formattedEndDate}.`;

            return res.status(200).json({
                message,
            });
        }

        return res.status(200).json({
            success: true,
            shouldNotify: false,
    
        });

    } catch (error) {
        console.error('Error fetching application notification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch application notification.'
        });
    }
};


const notifyManagersOfSubmittedAppraisals = async (req, res) => {
    try {
        const { managerName } = req.params;

        if (!managerName) {
            return res.status(400).json({
                success: false,
                message: "Manager name is required",
            });
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);


        const appraisals = await Appraisal.find({
            managerName: managerName,
            status: "Submitted",
        });

        if (appraisals.length === 0) {
            return res.status(404).json({
                success: false,
            });
        }

        const notifications = [];

        for (const appraisal of appraisals) {
            const { empName, timePeriod } = appraisal;

            if (timePeriod && timePeriod.length === 2) {
                const appraisalStartDate = new Date(timePeriod[0]);
                const appraisalEndDate = new Date(timePeriod[1]);


                const timeDifference = appraisalStartDate - currentDate;
                const daysUntilStart = Math.floor(timeDifference / (1000 * 60 * 60 * 24));


                const manager = await Employee.findOne({
                    empName: managerName,
                    empType: "Manager",
                });

                if (!manager) {
                    return res.status(404).json({
                        success: false,
                        message: "Manager information not found",
                    });
                }


                notifications.push({
                    employeeName: empName,
                    managerName: managerName,
                    submissionDate: new Date(),
                    message: `${empName} has submitted their appraisal on ${new Date().toISOString().split('T')[0]} for the year ${appraisalStartDate.toISOString().split('T')[0]} to ${appraisalEndDate.toISOString().split('T')[0]}.`,

                });
            }
        }

        const employeeNamesList = notifications.map((notification) => notification.employeeName).join(', ');

        res.status(200).json({
            success: true,
            notifications,
            message: `Notifications for the following employees: ${employeeNamesList}`,
        });

    } catch (error) {
        console.error("Error fetching manager notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching manager notifications",
            error: error.message,
        });
    }
};


const notifyGoalsAssaigned = async (req, res) => {
    try {
        const { employeeId, managerName } = req.params;

        if (!managerName) {
            return res.status(400).json({
                success: false,
                message: "Manager Name is required"
            });
        }
        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee Id is required"
            });
        }

        const goal = await Goals.findOne({
            employeeId,
            "goals.GoalStatus": "Goals Submitted"
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goals not submitted for this employee"
            });
        }

        const presentYear = new Date().getFullYear();
        const nextYear = presentYear + 1;

        const notificationMessage = `Your manager ${managerName} has assigned you goals for the year ${presentYear} to ${nextYear}.`;

        const hasSubmittedGoals = goal.goals.some(g => g.GoalStatus === "Goals Submitted");

        if (hasSubmittedGoals) {
            return res.status(200).json({
                success: true,
                notificationMessage,
            });
        }

        return res.status(404).json({
            success: false,
            message: "No goals with the status 'Goals Submitted' found",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sending Notification",
            error: error.message,
        });
    }
};


const notifyHRForUnderReviewAppraisals = async (req, res) => {
    try {
        const { empType } = req.params;

        if (empType !== 'HR') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only HR can receive these notifications.'
            });
        }

        const appraisals = await Appraisal.find({
            status: 'Under HR Review'
        });

        if (appraisals.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No appraisals found under HR review.'
            });
        }

        const notifications = [];

        appraisals.forEach((appraisal) => {
            const appraisalStartDate = new Date(appraisal.timePeriod[0]);
            const appraisalEndDate = new Date(appraisal.timePeriod[1]);
            const formattedStartDate = appraisalStartDate.toLocaleDateString();
            const formattedEndDate = appraisalEndDate.toLocaleDateString();

            const empName = appraisal.empName;
            const managerName = appraisal.managerName || 'the manager';

            notifications.push({
                employeeId: appraisal.employeeId,
                message: `Appraisal for ${empName} is approved by ${managerName} for the year ${formattedStartDate} to ${formattedEndDate}.`
            });
        });

        return res.status(200).json({
            success: true,
            message: 'Appraisal notifications for HR under review have been sent.',
            notifications
        });

    } catch (error) {
        console.error('Error while notifying HR:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to notify HR. Please try again later.'
        });
    }
};






module.exports = { notifyHRForUnderReviewAppraisals, notifyManagersOfSubmittedAppraisals, deleteAppraisalForm, getApplicationNotificationStarts, getApplicationNotification, saveAppraisalDetails, updateAppraisalStatus, getAppraisals, getAppraisalAnswers, getEmployeeAppraisal, createAppraisalForm, sendExpiringAppraisalNotification, notifyGoalsAssaigned }