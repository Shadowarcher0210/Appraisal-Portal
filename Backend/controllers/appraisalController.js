const Appraisal = require('../models/Appraisal');
const Employee = require('../models/User')
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json())

const saveAppraisalDetails = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;
    const { pageData } = req.body;
    const isExit = req.query.isExit === 'true';
    try {
        if (!employeeId) {
            return res.status(400).send({ error: 'User ID is required' });
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
        const newStatus = isExit ? 'In Progress' : 'Submitted';
        const updatedAppraisal = await Appraisal.findOneAndUpdate(
            {
                employeeId: employeeId,
                timePeriod: { $all: timePeriod },
            },
            { pageData, status: newStatus },
            { new: true }
        );

        if (!updatedAppraisal) {
            return res.status(404).json({ message: 'Appraisal form not found.' });
        }

        res.status(201).send({
            message: 'Appraisal form saved successfully!',
            data: updatedAppraisal,
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

        const validStatuses = ["To Do", "In Progress", "Submitted", "Under Review", "Completed"];
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

        console.log('Retrieved Appraisals:', appraisals);
        //checking dep
        console.log("dep,", appraisals[0].department)
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
            { pageData: 1, timePeriod: 1, empName: 1, designation: 1, department: 1, band: 1, managerName: 1 });


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
            pageData: appraisal.pageData

        }));
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).send('Error fetching appraisal data');
    }
};

//for performance tab
const getEmployeeAppraisal = async (req, res) => {
    try {
        const { employeeId } = req.params;
        // const user = await Employee.findOne(employeeId, '-password');
        const statuses = ['Submitted', 'Under Review', 'Completed'];
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

        // Validate required fields
        if (!employeeId || !timePeriod) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Fetch employee details based on employeeId
        const employee = await Employee.findOne({ employeeId: employeeId }); // Assuming Employee is your model for employees

        // Check if the employee exists
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        // Check if an appraisal already exists for this employee in the same time period
        const existingAppraisal = await Appraisal.findOne({
            employeeId: employeeId,
            timePeriod: timePeriod,
        });

        // If appraisal exists, return a message
        if (existingAppraisal) {
            return res.status(400).json({ message: 'An appraisal already exists for this employee in the specified time period.' });
        }

        // Create new appraisal form
        const newAppraisal = new Appraisal({
            employeeId,
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

        // Save the appraisal form
        const savedAppraisal = await newAppraisal.save();
        res.status(201).json({ message: 'Appraisal form created successfully', data: savedAppraisal });

    } catch (error) {
        console.error('Error in creating appraisal form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const sendExpiringAppraisalNotification = async (req, res) => {
    const { employeeId, startDate } = req.params;

    try {

        const startDateTime = new Date(startDate);

        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please use YYYY-MM-DD format'
            });
        }


        const endDateTime = new Date(startDateTime);
        endDateTime.setDate(endDateTime.getDate() + 7);


        startDateTime.setHours(0, 0, 0, 0);
        endDateTime.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const notificationDate = new Date(endDateTime);
        notificationDate.setDate(notificationDate.getDate() - 7);

        const query = {
            employeeId: employeeId,
            timePeriod: {
                $exists: true,
                $size: 2
            }
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
                message: `No appraisal found for this user`
            });
        }

        const formattedEndDate = endDateTime.toISOString().split('T')[0];
        const formattedNotificationDate = notificationDate.toISOString().split('T')[0];

        let message = null;

        if (today >= endDateTime) {
            message = `Your appraisal has expired. End date was: ${formattedEndDate}`;
        } else if (today >= notificationDate) {
            const daysRemaining = Math.ceil((endDateTime - today) / (1000 * 60 * 60 * 24));
            message = `Your appraisal will expire in ${daysRemaining} days. End date: ${formattedEndDate}`;
        } else {
            message = `Your appraisal is active. End date: ${formattedEndDate}`;
        }

        return res.status(200).json({
            success: true,
            data: {
                employeeId,
                startDate: startDate,
                endDate: formattedEndDate,
                notificationDate: formattedNotificationDate,
                message
            }
        });

    } catch (error) {
        console.error('Error checking appraisal expiration:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error checking appraisal expiration',
            error: error.message
        });
    }
};
module.exports = { saveAppraisalDetails, updateAppraisalStatus, getAppraisals, getAppraisalAnswers, getEmployeeAppraisal, createAppraisalForm, sendExpiringAppraisalNotification }