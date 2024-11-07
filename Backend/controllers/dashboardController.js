const Employee = require('../models/User');
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('empName -_id');
        console.log(employees)
        res.status(200).json(employees)
    } catch (error) {
        console.error('Error fetching employee names:', error);
        res.status(500).send('Error fetching employee data');
    }
}
const getEmpDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const user = await Employee.findOne({ employeeId: employeeId }, '-password');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Employee not found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Employee details retrieved successfully',
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching user details',
            error,
        });
    }
};

module.exports = { getEmployees, getEmpDetails }