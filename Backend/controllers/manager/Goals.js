const Goals = require('../../models/Goals');

// const postEmployeeGoals = async (req, res) => {
//     try {
//         const { employeeId, startDate, endDate } = req.params; 
//         const { empName, category, description, weightage, deadline } = req.body;

//         const timePeriod = [new Date(startDate), new Date(endDate)];


//         if (!empName || !category || !description || !weightage || !deadline) {
//             return res.status(400).json({ message: 'All required fields must be provided.' });
//         }

//         const existingGoal = await Goals.findOne({
//             employeeId,
//             timePeriod: { $all: timePeriod },
//         }); 

//         if (existingGoal) {
//             return res.status(409).json({ message: 'Goal for this time period already exists.' });
//         }

//         const newGoal = new Goals({
//             employeeId,
//             empName,
//             category,
//             description,
//             weightage,
//             deadline: new Date(deadline).toISOString().split('T')[0],
//             timePeriod, 
//         });

//         const savedGoal = await newGoal.save();
//         res.status(201).json({ message: 'Goal created successfully', data: savedGoal });

//     } catch (error) {
//         console.error('Error in creating goal:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
// const postEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId } = req.params;
//         const { empName, category, description, weightage, deadline } = req.body;

//         if (!empName || !category || !description || !weightage || !deadline) {
//             return res.status(400).json({ message: 'All required fields must be provided.' });
//         }

//         const newGoal = new Goals({
//             employeeId,
//             empName,
//             category,
//             description,
//             weightage,
//             deadline: new Date(deadline).toISOString().split('T')[0], // Ensure the date format is correct
//         });

//         const savedGoal = await newGoal.save();
//         res.status(201).json({ message: 'Goal created successfully', data: savedGoal });

//     } catch (error) {
//         console.error('Error in creating goal:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const postEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId } = req.params;
//         const goals = req.body.goals;

//         if (!goals || !Array.isArray(goals) || goals.length === 0) {
//             return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
//         }

//         for (const goal of goals) {
//             const { empName, category, description, weightage, deadline } = goal;

//             if (!empName || !category || !description || !weightage || !deadline) {
//                 return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
//             }
//         }

//         const newGoals = goals.map((goal) => new Goals({
//             employeeId,
//             empName: goal.empName,
//             category: goal.category,
//             description: goal.description,
//             weightage: goal.weightage,
//             deadline: new Date(goal.deadline).toISOString().split('T')[0], // Ensure the date format is correct
//         }));

//         const savedGoals = await Goals.insertMany(newGoals);

//         res.status(201).json({ message: 'Goals created successfully', data: savedGoals });

//     } catch (error) {
//         console.error('Error in creating goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
const postEmployeeGoal = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const goals = Array.isArray(req.body) ? req.body : req.body.goals;

        // Check if goals array is provided and non-empty
        if (!goals || !Array.isArray(goals) || goals.length === 0) {
            return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
        }

        // Validate each goal in the array
        for (const goal of goals) {
            const { empName, category, description, weightage, deadline } = goal;

            if (!empName || !category || !description || !weightage || !deadline) {
                return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
            }
        }

        // Map over the array to create new goal documents
        const newGoals = goals.map((goal) => new Goals({
            employeeId,
            empName: goal.empName,
            category: goal.category,
            description: goal.description,
            weightage: goal.weightage,
            deadline: new Date(goal.deadline).toISOString().split('T')[0], // Ensure the date format is correct
        }));

        // Save all goals at once using insertMany
        const savedGoals = await Goals.insertMany(newGoals);

        res.status(201).json({ message: 'Goals created successfully', data: savedGoals });

    } catch (error) {
        console.error('Error in creating goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getEmployeeGoal = async (req, res) => {
    try {
        const { employeeId} = req.params;

        // const start = new Date(startDate).toISOString().split('T')[0];
        // const end = new Date(endDate).toISOString().split('T')[0];

        const goals = await Goals.find({
            employeeId,
            // $or: [
            //     { 
            //         'timePeriod.0': { $lte: end }, 
            //         'timePeriod.1': { $gte: start }, 
            //     }
            // ]
        });
      //  console.log('Query Date Range:', { start, end });

        if (goals.length === 0) {
            return res.status(404).json({ message: 'No goals found for the specified period.' });
        }

        res.status(200).json({ message: 'Goals retrieved successfully', data: goals });
    } catch (error) {
        console.error('Error in fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { postEmployeeGoal, getEmployeeGoal };
 