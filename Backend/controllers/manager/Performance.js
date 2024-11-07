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

const managerEvaluation = async (req, res) => {
    const { employeeId, timePeriod, empScore } = req.body;

    if (!employeeId || !timePeriod || timePeriod.length !== 2 || !empScore) {
        return res.status(400).json({ message: 'employeeId, timePeriod , and empScore are required' });
    }

    try {
        const appraisal = await Appraisal.findOneAndUpdate(
            { employeeId, timePeriod },
            { empScore },
            { new: true }
        );

        if (!appraisal) {
            return res.status(404).json({ message: 'Appraisal record not found' });
        }

        res.status(200).json({ message: 'EmpScore updated successfully', appraisal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = { getEmployeeAppraisals, managerEvaluation };
