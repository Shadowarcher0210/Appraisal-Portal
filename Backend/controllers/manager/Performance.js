const AdditionalAreas = require("../../models/AdditionalAreas");
const Appraisal = require("../../models/Appraisal");
const ManagerEvaluation = require("../../models/ManagerEvalution");

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
    const { employeeId, startDate, endDate } = req.params;
    const { payload } = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required.' });
    }

    const timePeriod = [
        new Date(startDate).toISOString().split('T')[0],
        new Date(endDate).toISOString().split('T')[0],
    ];

    // Check if startDate is before endDate
    if (timePeriod[0] > timePeriod[1]) {
        return res.status(400).json({ error: 'Start date cannot be later than end date.' });
    }

    if (!Array.isArray(payload)) {
        return res.status(400).json({
            error: 'Payload must contain an array of 19 quality questions.',
        });
    }

    try {
        // Check if a record for the given employeeId and timePeriod already exists
        const existingRecord = await AdditionalAreas.findOne({
            employeeId,
            timePeriod, 
        });

        if (existingRecord) {
            // If the record exists, update it by replacing the areas array with the new answers
            existingRecord.areas = payload;
            await existingRecord.save();
            return res.status(200).json({
                message: 'Additional details updated successfully!',
                data: existingRecord,
            });
        } else {
            // If no record exists, create a new one
            const newAdditional = new AdditionalAreas({
                employeeId,
                timePeriod,
                areas: payload,  // Store all the quality answers in one array
            });
            await newAdditional.save();
            return res.status(201).json({
                message: 'Additional details saved successfully!',
                data: newAdditional,
            });
        }
    } catch (error) {
        console.error('Error saving additional details:', error);
        res.status(500).json({
            error: 'Error saving additional details.',
            details: error.message,
        });
    }
};
const getAdditionalDetails = async (req,res)=>{
    const { employeeId, startDate, endDate } = req.params;
    if (!employeeId || !startDate || !endDate) {
        return res.status(400).json({
            error: 'Employee ID, start date, and end date are required.',
        });
    }
    const timePeriod = [
        new Date(startDate).toISOString().split('T')[0],
        new Date(endDate).toISOString().split('T')[0],
    ];
    if (timePeriod[0] > timePeriod[1]) {
        return res.status(400).json({
            error: 'Start date cannot be later than end date.',
        });
    }

    try {
       
        const record = await AdditionalAreas.findOne({
            employeeId,
            timePeriod, 
        });

        if (!record) {
            return res.status(404).json({
                message: 'No additional details found for this employee during the specified time period.',
            });
        }
        return res.status(200).json({
            message: 'Additional details retrieved successfully!',
            data: record,
        });
    } catch (error) {
        console.error('Error retrieving additional details:', error);
        return res.status(500).json({
            error: 'Error retrieving additional details.',
            details: error.message,
        });
    }

}
const saveManagerEvaluation = async (req, res) => {
    const { managerRating, additionalComments } = req.body;
    const { employeeId, managerName, startDate, endDate } = req.params;

    if (!employeeId || !managerName || !startDate || !endDate) {
        return res.status(400).json({ error: 'Employee ID, managerName, startDate, and endDate are required.' });
    }

    try {
        const timePeriodStart = new Date(startDate);
        const timePeriodEnd = new Date(endDate);

        if (isNaN(timePeriodStart.getTime()) || isNaN(timePeriodEnd.getTime())) {
            return res.status(400).json({ error: 'Invalid startDate or endDate format. Please use YYYY-MM-DD format.' });
        }

        const timePeriod = [timePeriodStart, timePeriodEnd];

        // Check if an evaluation already exists
        const existingEvaluation = await ManagerEvaluation.findOne({
            employeeId,
            managerName,
            timePeriod,
        });

        if (existingEvaluation) {
            // Update existing evaluation
            existingEvaluation.managerRating = managerRating;
            existingEvaluation.additionalComments = additionalComments;
            await existingEvaluation.save();

            return res.status(200).json({
                message: "Overall rating updated successfully!",
                data: existingEvaluation,
            });
        }

        // Create new evaluation if not found
        const newEvaluation = new ManagerEvaluation({
            employeeId,
            managerName,
            timePeriod,
            managerRating,
            additionalComments,
        });

        await newEvaluation.save();

        res.status(201).json({
            message: "Overall rating saved successfully!",
            data: newEvaluation,
        });
    } catch (error) {
        console.error('Error saving or updating overall rating:', error);
        return res.status(500).json({
            error: 'Failed to save or update overall rating.',
            details: error.message,
        });
    }
};


const getManagerEvaluation = async (req, res) => {
    const { employeeId, startDate, endDate, managerName } = req.params;

    if (!employeeId || !startDate || !endDate || !managerName) {
        return res.status(400).json({ error: 'Employee ID, startDate, endDate, and managerName are required.' });
    }

    try {
        const timePeriodStart = new Date(startDate);
        const timePeriodEnd = new Date(endDate);

        if (isNaN(timePeriodStart.getTime()) || isNaN(timePeriodEnd.getTime())) {
            return res.status(400).json({ error: 'Invalid startDate or endDate format. Please use YYYY-MM-DD format.' });
        }

        const appraisals = await Appraisal.find({
            managerName,
            employeeId,
            "timePeriod.0": { $lte: timePeriodEnd }, 
            "timePeriod.1": { $gte: timePeriodStart }, 
        });

        if (appraisals.length === 0) {
            return res.status(404).json({ error: 'No appraisals found for the specified time period and manager.' });
        }

        const timePeriod = appraisals[0].timePeriod;

        const evaluation = await ManagerEvaluation.findOne({
            employeeId,
            managerName,
            "timePeriod.0": { $lte: timePeriodEnd }, 
            "timePeriod.1": { $gte: timePeriodStart }, 
        });

        if (!evaluation) {
            return res.status(404).json({ error: 'No evaluation found for the specified employee and time period.' });
        }

        const { managerRating, additionalComments, _id } = evaluation;

        res.status(200).json({
            message: 'Manager evaluation retrieved successfully!',
            data: {
                managerRating,
                additionalComments,
                _id,
                employeeId,
                managerName,
                timePeriod,
            },
        });
    } catch (error) {
        console.error('Error getting manager evaluation:', error);
        return res.status(500).json({
            error: 'Failed to get manager evaluation.',
            details: error.message,
        });
    }
};

module.exports = { getEmployeeAppraisals, saveAdditionalDetails, getAdditionalDetails,saveManagerEvaluation,getManagerEvaluation };
