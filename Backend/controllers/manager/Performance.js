const AdditionalAreas = require("../../models/AdditionalAreas");
const Appraisal = require("../../models/Appraisal");
const Goals = require("../../models/Goals");
const ManagerEvaluation = require("../../models/ManagerEvaluation");
const OverallWeightage = require("../../models/OverallWeightage");

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
            status: { $in: ["Submitted", "Under Review", "Under HR Review", "Completed"] }
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
    const { payload, overallScore} = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required.' });
    }

    const timePeriod = [
        new Date(startDate).toISOString().split('T')[0],
        new Date(endDate).toISOString().split('T')[0],
    ];

    if (timePeriod[0] > timePeriod[1]) {
        return res.status(400).json({ error: 'Start date cannot be later than end date.' });
    }

    if (!Array.isArray(payload)) {
        return res.status(400).json({
            error: 'Payload must contain an array of 19 quality questions.',
        });
    }

    if (typeof overallScore !== 'number') {
        return res.status(400).json({
            error: 'Overall score is required and must be a number.',
        });
    }

    try {
        const existingRecord = await AdditionalAreas.findOne({
            employeeId,
            timePeriod, 
        });

        if (existingRecord) {
            existingRecord.areas = payload;
            existingRecord.overallScore = overallScore;
            await existingRecord.save();
            return res.status(200).json({
                message: 'Additional details updated successfully!',
                data: existingRecord,
            });
        } else {
            const newAdditional = new AdditionalAreas({
                employeeId,
                timePeriod,
                areas: payload, 
                overallScore,
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
    const { managerRating, convertedRating, additionalComments } = req.body;
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
            existingEvaluation.convertedRating = convertedRating;
            existingEvaluation.additionalComments = additionalComments;
            await existingEvaluation.save();

            return res.status(200).json({
                message: "Converted rating updated successfully!",
                data: existingEvaluation,
            });
        }

        // Create new evaluation if not found
        const newEvaluation = new ManagerEvaluation({
            employeeId,
            managerName,
            timePeriod,
            managerRating,
            convertedRating,
            additionalComments,
        });

        await newEvaluation.save();

        res.status(201).json({
            message: "Converted rating saved successfully!",
            data: newEvaluation,
        });
    } catch (error) {
        console.error('Error saving or updating Converted rating:', error);
        return res.status(500).json({
            error: 'Failed to save or update Converted rating.',
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

        const { managerRating, convertedRating, additionalComments, _id } = evaluation;

        res.status(200).json({
            message: 'Manager evaluation retrieved successfully!',
            data: {
                managerRating,
                convertedRating,
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

const getOverallEvaluation = async (req, res) => {
    const { employeeId, startDate, endDate } = req.params;

    if (!employeeId || !startDate || !endDate) {
        return res.status(400).json({ message: 'Employee ID, startDate, and endDate are required' });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Fetch self-assessment (only 'overallScore')
        const selfAssesment = await Appraisal.findOne(
            {
                employeeId,
                timePeriod: { $all: [start, end] }, // Ensures exact match for timePeriod
            },
            { overallScore: 1, _id: 0 }
        );

        // // Fetch Goals overall score
        // const goalsOverAll = await Goals.findOne(
        //     {
        //         employeeId,
        //         timePeriod: { $all: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]] }, // Match as ISO date strings
        //     },
        //     { overallGoalScore: 1 }
        // );

        // Fetch Additional Areas overall score
        const additionalAreasOverall = await AdditionalAreas.findOne(
            {
                employeeId,
                timePeriod: { $all: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]] },
            },
            { overallScore: 1 }
        );

        // Fetch Manager Evaluation converted rating
        const managerRating = await ManagerEvaluation.findOne(
            {
                employeeId,
                timePeriod: { $all: [start, end] }, // Match directly as dates
            },
            { convertedRating: 1, _id: 0 }
        );

        const managerEvaluations = {};

        if (selfAssesment && selfAssesment.overallScore !== undefined) {
            managerEvaluations.selfAssesment = selfAssesment.overallScore;
        }

        // if (goalsOverAll && goalsOverAll.overallGoalScore !== undefined) {
        //     managerEvaluations.goalsOverAll = goalsOverAll.overallGoalScore;
        // }

        if (additionalAreasOverall && additionalAreasOverall.overallScore !== undefined) {
            managerEvaluations.additionalAreasOverall = additionalAreasOverall.overallScore;
        }

        if (managerRating && managerRating.convertedRating !== undefined) {
            managerEvaluations.managerRating = managerRating.convertedRating;
        }

        if (Object.keys(managerEvaluations).length === 0) {
            return res.status(404).json({ message: 'No evaluations found for the given employee and time period' });
        }

        return res.status(200).json(managerEvaluations);

    } catch (error) {
        console.error('Error fetching evaluations:', error);
        return res.status(500).json({ message: 'An error occurred while fetching evaluations' });
    }
};

const postOverAllWeightage = async (req, res)=>{
    const { employeeId, startDate, endDate } = req.params;
    const {overallWeightage } = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required.' });
    }

    const timePeriod = [
        new Date(startDate).toISOString().split('T')[0],
        new Date(endDate).toISOString().split('T')[0],
    ];

    if (timePeriod[0] > timePeriod[1]) {
        return res.status(400).json({ error: 'Start date cannot be later than end date.' });
    }

    if (typeof overallWeightage !== 'number') {
        return res.status(400).json({
            error: 'Overall score is required and must be a number.',
        });
    }

    try {
        const existingRecord = await OverallWeightage.findOne({
            employeeId,
            timePeriod, 
        });
        if (existingRecord){
            
            existingRecord.overallWeightage = overallWeightage;
            await existingRecord.save();
            return res.status(200).json({
                message: 'Additional details updated successfully!',
                data: existingRecord,
            }); 
        }else {
            const newAdditional = new OverallWeightage({
                employeeId,
                timePeriod,
                overallWeightage,
            });
            await newAdditional.save();
            return res.status(201).json({
                message: 'Additional details saved successfully!',
                data: newAdditional,
            });
        }
    }
        catch (error) {
        console.error('Error saving overallWeightage details:', error);
        res.status(500).json({
            error: 'Error saving overallWeightage details.',
            details: error.message,
        });
    }
}


module.exports = { getEmployeeAppraisals, saveAdditionalDetails, getAdditionalDetails,saveManagerEvaluation,getManagerEvaluation,getOverallEvaluation,postOverAllWeightage };
