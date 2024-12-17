const Appraisal = require("../../models/Appraisal");
const User = require("../../models/User");

const getEmployeeAppraisals = async (req, res) => {
    const {startDate, endDate } = req.params;

    try {
       
        console.log('Start Date:', new Date(startDate));
        console.log('End Date:', new Date(endDate));

        const appraisals = await Appraisal.find({
        
            $expr: {
                $and: [
                    { $gte: [{ $arrayElemAt: ["$timePeriod", 0] }, new Date(startDate)] },
                    { $lte: [{ $arrayElemAt: ["$timePeriod", 1] }, new Date(endDate)] }
                ]
            },
            status: { $in: [ "Pending HR Review" , "Under HR Review",'Completed'] }
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
const getAllEmployees = async (req, res) => {
    try {
        const users = await User.find(); 
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No employees found."
            });
        }

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching employees."
        });
    }
};

module.exports = {getEmployeeAppraisals,getAllEmployees}