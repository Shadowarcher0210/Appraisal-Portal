const Appraisal = require("../../models/Appraisal");

const getEmployeeAppraisals = async (req, res) => {
    const { managerName, startDate, endDate } = req.params;

    try {
        const appraisals = await Appraisal.find({
            managerName,
            $expr: {
                $and: [
                    { $gte: [{ $arrayElemAt: ["$timePeriod", 0] }, new Date(startDate)] },
                    { $lte: [{ $arrayElemAt: ["$timePeriod", 1] }, new Date(endDate)] }
                ]
            },
            status: { $in: ["Submitted", "Completed"] }
        });

        res.status(200).json({ success: true, data: appraisals });
    } catch (error) {
        console.error("Error fetching appraisals:", error);
        res.status(500).json({ success: false, message: "Failed to fetch appraisals" });
    }
};


module.exports = { getEmployeeAppraisals };
