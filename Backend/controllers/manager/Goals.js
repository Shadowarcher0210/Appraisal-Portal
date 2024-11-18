const Goals = require('../../models/Goals');
const User = require('../../models/User');


const postEmpGoals = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.params; 
        const timePeriod = [new Date(startDate), new Date(endDate)];
        const user = await User.findOne({ employeeId });
        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const empName = user.empName; 

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
            const { category, description, weightage, deadline } = goal;

            if (!category || !description || !weightage || !deadline) {
                return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
            }
        }

        const newGoals = goals.map((goal) => new Goals({
            employeeId,
            empName,
            category: goal.category,
            description: goal.description,
            weightage: goal.weightage,
            deadline: new Date(goal.deadline).toISOString().split('T')[0],
            timePeriod, 
        }));

        // const savedGoal = await newGoal.save();
        const savedGoals = await Goals.insertMany(newGoals);

        res.status(201).json({ message: 'Goal created successfully', data: savedGoals });

    } catch (error) {
        console.error('Error in creating goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getEmpGoals = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.params;

        const start = new Date(startDate).toISOString().split('T')[0];
        const end = new Date(endDate).toISOString().split('T')[0];

   

        console.log('Query Date Range:', { start, end });

        const goals = await Goals.find({
            employeeId,
            'timePeriod.0': { $lte: end }, 
            'timePeriod.1': { $gte: start }, 
        });
        console.log("goals", goals)

        if (goals.length === 0) {
            return res.status(404).json({ message: 'No goals found for the specified period.' });
        }

        res.status(200).json({ message: 'Goals retrieved successfully', data: goals });

    } catch (error) {
        console.error('Error in fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const editGoals = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.params;
        const { category, description, weightage, deadline } = req.body;

        // Validate required fields in the request body
        if (!category || !description || !weightage || !deadline) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Convert the startDate and endDate to proper Date objects and format them
        const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];

        // Find the goal using the employeeId and the timePeriod
        const goal = await Goals.findOne({ employeeId, timePeriod });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found for this employee in the specified period.' });
        }

        // Update the fields of the goal
        goal.category = category;
        goal.description = description;
        goal.weightage = weightage;
        goal.deadline = new Date(deadline).toISOString().split('T')[0]; // Ensure the deadline is formatted properly

        // Save the updated goal
        const updatedGoal = await goal.save();

        res.status(200).json({ message: 'Goal updated successfully', data: updatedGoal });

    } catch (error) {
        console.error('Error in editing goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getEmployeeGoal2 = async (req,res) => { 
    try {
        const { employeeId} = req.params;
   
        const categories = ["Development", "Technical", "Soft Skills", "Leadership", "Others"];

       
        res.status(200).json({ message: 'Categories retrieved successfully',employeeId, data: categories });
    } catch (error) {
        console.error('Error in fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


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

// const postEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId } = req.params;
//         const goals = Array.isArray(req.body) ? req.body : req.body.goals;

//         if (!goals || !Array.isArray(goals) || goals.length === 0) {
//             return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
//         }

//         for (const goal of goals) {
//             const { employeeId, empName, category, description, weightage, deadline } = goal;

//             if ( !empName || !category || !description || !weightage || !deadline) {
//                 return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
//             }
//         }

//         const newGoals = goals.map((goal) => new Goals({
//             employeeId,
//             empName: goal.empName,
//             category: goal.category,
//             description: goal.description,
//             weightage: goal.weightage,
//             deadline: new Date(goal.deadline).toISOString().split('T')[0], 
//         }));

//         const savedGoals = await Goals.insertMany(newGoals);

//         res.status(201).json({ message: 'Goals created successfully', data: savedGoals });

//     } catch (error) {
//         console.error('Error in creating goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };



// posting goals without timePeriod
// const postEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId } = req.params;
//         const user = await User.findOne({ employeeId });
//         if (!user) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }
//         const empName = user.empName; 

//         const goals = Array.isArray(req.body) ? req.body : req.body.goals;

//         if (!goals || !Array.isArray(goals) || goals.length === 0) {
//             return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
//         }

//         for (const goal of goals) {
//             const { category, description, weightage, deadline } = goal;

//             if (!category || !description || !weightage || !deadline) {
//                 return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
//             }
//         }

//         const newGoals = goals.map((goal) => new Goals({
//             employeeId,
//             empName, 
//             category: goal.category,
//             description: goal.description,
//             weightage: goal.weightage,
//             deadline: new Date(goal.deadline).toISOString().split('T')[0], 
//         }));

//         const savedGoals = await Goals.insertMany(newGoals);

//         res.status(201).json({ message: 'Goals created successfully', data: savedGoals });

//     } catch (error) {
//         console.error('Error in creating goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


//fetching goals without timeperiod
// const getEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId} = req.params;
//         const goals = await Goals.find({
//             employeeId
//         });

//         if (goals.length === 0) {
//             return res.status(404).json({ message: 'No goals found for the specified period.' });
//         }
//         res.status(200).json({ message: 'Goals retrieved successfully', data: goals });
//     } catch (error) {
//         console.error('Error in fetching goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const editGoal = async (req, res) => {
//     try {
//         const { employeeId, goalId } = req.params; 
//         const { category, description, weightage, deadline } = req.body;

//         if (!category || !description || !weightage || !deadline) {
//             return res.status(400).json({ message: 'All required fields must be provided.' });
//         }

//         const goal = await Goals.findOne({ _id: goalId, employeeId });

//         if (!goal) {
//             return res.status(404).json({ message: 'Goal not found for this employee.' });
//         }

//         goal.category = category;
//         goal.description = description;
//         goal.weightage = weightage;
//         goal.deadline = new Date(deadline).toISOString().split('T')[0]; 

//         const updatedGoal = await goal.save();

//         res.status(200).json({ message: 'Goal updated successfully', data: updatedGoal });
//     } catch (error) {
//         console.error('Error in editing goal:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };




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






// const postEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId } = req.params;
//         const user = await User.findOne({ employeeId });
//         if (!user) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }
//         const empName = user.empName;

//         const goals = Array.isArray(req.body) ? req.body : req.body.goals;

//         if (!goals || !Array.isArray(goals) || goals.length === 0) {
//             return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
//         }

      
//         for (const goal of goals) {
//             const { category, description, weightage, deadline, otherText } = goal;

//             if (!category || !description || !weightage || !deadline) {
//                 return res.status(400).json({ message: 'Each goal must have all required fields provided.' });
//             }

//             if (category === 'Others' && !otherText) {
//                 return res.status(400).json({ message: 'Additional text is required for the Others category.' });
//             }
//         }

       
//         const newGoals = goals.map((goal) => {
//             const goalData = {
//                 employeeId,
//                 empName, 
//                 category: goal.category,
//                 description: goal.description,
//                 weightage: String(goal.weightage), 
//                 deadline: new Date(goal.deadline).toISOString().split('T')[0],
//                 otherText: goal.category === 'Others' ? goal.otherText : undefined
//             };

//             return new Goals(goalData);
//         });

      
//         const savedGoals = await Goals.insertMany(newGoals);

        
//         res.status(201).json({
//             message: 'Goals created successfully',
//             data: savedGoals.map(goal => ({
//                 employeeId: goal.employeeId,
//                 empName: goal.empName,
//                 category: goal.category,
//                 otherText: goal.otherText, 
//                 description: goal.description,
//                 weightage: goal.weightage,
//                 deadline: goal.deadline,
//                 _id: goal._id,
//                 __v: goal.__v
//             }))
//         });

//     } catch (error) {
//         console.error('Error in creating goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };




// const getEmployeeGoal = async (req, res) => {
//     try {
//         const { employeeId} = req.params;

//         // const start = new Date(startDate).toISOString().split('T')[0];
//         // const end = new Date(endDate).toISOString().split('T')[0];

//         const goals = await Goals.find({
//             employeeId,
//             // $or: [
//             //     { 
//             //         'timePeriod.0': { $lte: end }, 
//             //         'timePeriod.1': { $gte: start }, 
//             //     }
//             // ]
//         });
//       //  console.log('Query Date Range:', { start, end });

//         if (goals.length === 0) {
//             return res.status(404).json({ message: 'No goals found for the specified period.' });
//         }

//         res.status(200).json({ message: 'Goals retrieved successfully', data: goals });
//     } catch (error) {
//         console.error('Error in fetching goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


module.exports = {  postEmpGoals, getEmpGoals, editGoals, getEmployeeGoal2 };
 