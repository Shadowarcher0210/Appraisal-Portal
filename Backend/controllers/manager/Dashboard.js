const Employees = require('../../models/User');

const getEmployeesForManager = async (req, res) => {
    const { managerName } = req.params;
    try {
  
        const employees = await Employees.find({ managerName }).select('empName employeeId designation department -_id');

        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ success: false, message: "Failed to fetch your Employees" });
    }
};

module.exports = { getEmployeesForManager };
