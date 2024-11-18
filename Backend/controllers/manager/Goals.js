const Goals = require('../../models/Goals');
const User = require('../../models/User');


const postEmployeeGoal = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.params;
        const timePeriod = [new Date(startDate), new Date(endDate)];
        
        const user = await User.findOne({ employeeId });
        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const { empName, empType } = user; 

        const existingGoal = await Goals.findOne({
            employeeId,
            timePeriod: { $all: timePeriod },
        });

        if (existingGoal) {
            return res.status(409).json({ message: 'Goal for this time period already exists.' });
        }

        const goals = Array.isArray(req.body) ? req.body : req.body.goals;

        if (!goals || !Array.isArray(goals) || goals.length === 0) {
            return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
        }

        for (const goal of goals) {
            const { category, description, weightage, deadline, otherText } = goal;

            if (!category || !description || !weightage || !deadline) {
                return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
            }

            if (category === 'Others' && !otherText) {
                return res.status(400).json({ message: 'Additional text is required for the Others category.' });
            }

            if (isNaN(new Date(deadline))) {
                return res.status(400).json({ message: `Invalid deadline date: ${deadline}` });
            }
        }

        const newGoals = goals.map((goal) => {
            return new Goals({
                employeeId,
                empName,
                empType, 
                category: goal.category,
                description: goal.description,
                weightage: String(goal.weightage),
                deadline: new Date(goal.deadline).toISOString().split('T')[0],
                otherText: goal.category === 'Others' ? goal.otherText : undefined,
                timePeriod,
            });
        });

        const savedGoals = await Goals.insertMany(newGoals);

        res.status(201).json({
            message: 'Goals created successfully',
            data: savedGoals.map((goal) => ({
                employeeId: goal.employeeId,
                empName: goal.empName,
                category: goal.category,
                otherText: goal.otherText,
                description: goal.description,
                weightage: goal.weightage,
                timePeriod: goal.timePeriod,
                deadline: goal.deadline,
                empType: goal.empType,  
                _id: goal._id,
                __v: goal.__v,
            })),
        });
    } catch (error) {
        console.error('Error in creating goals:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getEmployeeGoal = async (req, res) => {
    try {
        const { employeeId, startDate, endDate} = req.params;

        const start = new Date(startDate).toISOString().split('T')[0];
        const end = new Date(endDate).toISOString().split('T')[0];

        const goals = await Goals.find({
            employeeId,
            'timePeriod.0': { $lte: end }, 
            'timePeriod.1': { $gte: start }, 
        });
    

        if (goals.length === 0) {
            return res.status(404).json({ message: 'No goals found for the specified period.' });
        }

        res.status(200).json({ message: 'Goals retrieved successfully', data: goals });
    } catch (error) {
        console.error('Error in fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getEmployeeGoal2 = async (req, res) => {
    try {
        const { empType } = req.params;

        const categoryMappings = {
            Employee: ["Development", "Technical", "Soft Skills", "Leadership"],
            Manager: ["Team Management", "Strategic Planning", "Conflict Resolution", "Leadership"],
            HR: ["Recruitment", "Employee Engagement", "Policy Development", "Training"],
        };

        const predefinedCategories = categoryMappings[empType] || ["General"];

        const employeeGoals = await Goals.find({ empType });

        const employeeOtherTexts = employeeGoals
            .filter(goal => goal.category === 'Others' && goal.otherText)
            .map(goal => goal.otherText);

        let categories = [...new Set([...predefinedCategories, ...employeeOtherTexts])];

        if (!categories.includes('Others')) {
            categories.push('Others');
        }

        res.status(200).json({
            message: 'Categories retrieved successfully',
            empType,
            data: categories,
        });
    } catch (error) {
        console.error('Error in fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const editGoal = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.params;
        const { category, description, weightage, deadline } = req.body;

       
        if (!category || !description || !weightage || !deadline) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];

        const goal = await Goals.findOne({ employeeId, timePeriod });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found for this employee in the specified period.' });
        }

        goal.category = category;
        goal.description = description;
        goal.weightage = weightage;
        goal.deadline = new Date(deadline).toISOString().split('T')[0]; 

        const updatedGoal = await goal.save();

        res.status(200).json({ message: 'Goal updated successfully', data: updatedGoal });

    } catch (error) {
        console.error('Error in editing goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { postEmployeeGoal, getEmployeeGoal,getEmployeeGoal2, editGoal };
 