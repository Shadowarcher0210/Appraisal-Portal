const Goals = require('../../models/Goals');

const EmployeeGoals = async (req, res) => {
    try {
        const { employeeId } = req.params; 
        const { empName, category, description, weightage, timePeriod, deadline } = req.body;

        if (!empName || !category || !description || !weightage || !timePeriod || !deadline) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const existingGoal = await Goals.findOne({ employeeId, timePeriod });
        if (existingGoal) {
            return res.status(409).json({ message: 'Goal for this time period already exists.' });
        }

        const newGoal = new Goals({
            employeeId,
            empName,
            category,
            description,
            weightage,
            timePeriod,
            deadline: new Date(deadline),
        });

        const savedGoal = await newGoal.save();
        res.status(201).json({ message: 'Goal created successfully', data: savedGoal });

    } catch (error) {
        console.error('Error in creating goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { EmployeeGoals };
