const AdditionalAreas = require("../../models/AdditionalAreas");
const Appraisal = require("../../models/Appraisal");

const getEmployeeAppraisals = async (req, res) => {
    const { managerName, startDate, endDate } = req.params;

    try {
       
        console.log('Start Date:', new Date(startDate));
        console.log('End Date:', new Date(endDate));

        const appraisals = await Appraisal.find({
            managerName,
            $expr: {
                $and: [
                    { $gte: [{ $arrayElemAt: ["$timePeriod", 0] }, new Date(startDate)] },
                    { $lte: [{ $arrayElemAt: ["$timePeriod", 1] }, new Date(endDate)] }
                ]
            },
            status: { $in: ["Submitted", "Under Review", "Under HR Review"] }
        });

        if (appraisals.length === 0) {
            return res.status(404).json({ success: false, message: "No appraisals found for the given period." });
        }

        res.status(200).json({ success: true, data: appraisals });
    } catch (error) {
        console.error("Error fetching appraisals:", error);
        res.status(500).json({ success: false, message: "Failed to fetch appraisals" });
    }
};

const saveAdditionalDetails = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;  // Employee ID and Time Period (startDate, endDate)
    const { quality, empName, successMetric, weightage, attainments, comments } = req.body;  // Other fields from request body

    if (!employeeId || !quality || !empName || !successMetric || !weightage || !attainments || !comments || !startDate || !endDate) {
        return res.status(400).json({
            error: 'All fields are required: employeeId, quality, empName, category, description, weightage, deadline, startDate, and endDate.'
        });
    }

    const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];
    
    if (timePeriod[0] > timePeriod[1]) {
        return res.status(400).json({ error: 'Start date cannot be later than end date.' });
    }

    try {
 
        const newAdditional = new AdditionalAreas({
            employeeId,
            quality,
            empName,
            successMetric,
            weightage,
            attainments,
            comments,
            timePeriod
        });

        // Save the new record
        const savedRecord = await newAdditional.save();

        // Send response with saved data
        res.status(201).json({
            message: 'Additional details saved successfully!',
            data: savedRecord
        });
    } catch (error) {
        console.error('Error saving additional details:', error);
        res.status(500).json({
            error: 'Error saving additional details.',
            details: error.message
        });
    }
};







module.exports = { getEmployeeAppraisals, saveAdditionalDetails };
