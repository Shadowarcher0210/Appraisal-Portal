const Goals = require('../../models/Goals');
const User = require('../../models/User');

const postEmployeeGoal = async (req, res) => {
    try {
      const { employeeId, startDate, endDate } = req.params;
    //  const timePeriod = [new Date(startDate), new Date(endDate)];
    const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];

      const user = await User.findOne({ employeeId });
      if (!user) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      const { empName, empType } = user;
  
      const existingGoal = await Goals.findOne({
        employeeId,
        timePeriod: { 
          $gte: new Date(startDate),
          $lte: new Date(endDate)
      },
      });
  
      if (existingGoal) {
        return res.status(409).json({ message: 'Goal for this time period already exists.' });
      }
  
      const goals = Array.isArray(req.body) ? req.body : req.body.goals;
  
      if (!goals || !Array.isArray(goals) || goals.length === 0) {
        return res.status(400).json({ message: 'Goals array is required and cannot be empty.' });
      }
  
      for (const goal of goals) {
        const { deadline } = goal;
        if (isNaN(new Date(deadline))) {
          return res.status(400).json({ message: `Invalid deadline date: ${deadline}` });
        }
      }
  
      const goalContentArray = goals.map((goal) => ({
        category: goal.category,
        description: goal.description,
        weightage: goal.weightage,  
        deadline: new Date(goal.deadline).toISOString().split('T')[0],
        otherText: goal.category === 'Others' ? goal.otherText : undefined,
        GoalStatus: "Goals Submitted", 
      }));
      console.log("Goal Content Array:", goalContentArray);

      const newGoalDocument = new Goals({
        employeeId,
        empName,
        empType,
        timePeriod,
        goals: goalContentArray, 
      });

      const savedGoalDocument = await newGoalDocument.save();
      await savedGoalDocument.populate('goals');
      console.log("Goals after saving:", savedGoalDocument.goals);
      

      res.status(201).json({
        message: 'Goals created successfully',
        employeeId,
        empName,
        empType,
        timePeriod,
        data: savedGoalDocument.goals.map((goal) => ({
          goalId: goal._id,
          category: goal.category,
          description: goal.description,
          weightage: goal.weightage,
          deadline: goal.deadline,
          otherText: goal.otherText,
          GoalStatus:  goal.GoalStatus,
        })),
      });
  
    } catch (error) {
      console.error('Error in creating goals:', error.message || error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const getEmployeeGoals = async (req, res) => {
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

const getGoalCategories = async (req, res) => {
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

// const updateManagerGoalWeight = async (req, res) => {
//     try {
//         const { goals } = req.body;
//         const { employeeId, startDate, endDate } = req.params
//         if (!Array.isArray(goals) || goals.length === 0) {
//             return res.status(400).json({ message: 'Goals array is required and cannot be empty' });
//         }

//         const results = [];

//         for (const goal of goals) {
//             const {managerWeightage } = goal;

//             if (managerWeightage === undefined) {
//                 results.push({
//                     status: 'Failed',
//                     message: 'Missing required fields',
//                 });
//                 continue;
//             }

//             const timePeriod = [new Date(startDate), new Date(endDate)];

//             const existingGoal = await Goals.findOne({ employeeId, timePeriod });

//             if (!existingGoal) {
//                 results.push({
//                     status: 'Failed',
//                     message: 'Goal not found',
//                 });
//                 continue;
//             }

//             if (managerWeightage > existingGoal.weightage) {
//                 results.push({
//                     status: 'Failed',
//                     message: 'Manager weightage must be less than or equal to the existing weightage',
//                 });
//                 continue;
//             }

//             existingGoal.managerWeightage = managerWeightage;
//             await existingGoal.save();

//             results.push({
//                 message: 'Manager weightage updated successfully',
//                 data: {
//                     employeeId: existingGoal.employeeId,
//                     empName: existingGoal.empName,
//                     category: existingGoal.category,
//                     description: existingGoal.description,
//                     weightage: existingGoal.weightage,
//                     managerWeightage: existingGoal.managerWeightage,
//                     deadline: existingGoal.deadline,
//                     timePeriod: existingGoal.timePeriod,
//                },
//             });
//         }

//         res.status(200).json( results);
//     } catch (error) {
//         console.error('Error in updating manager weights:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

//latest
//const updateManagerGoalWeight = async (req, res) => {
//   try {
//     const { goals } = req.body;
//     const { employeeId, startDate, endDate } = req.params;

//     if (!Array.isArray(goals) || goals.length === 0) {
//       return res.status(400).json({ message: 'Goals array is required and cannot be empty' });
//     }

//     const results = [];

//     for (const goal of goals) {
//       const { managerWeightage } = goal;

//       if (managerWeightage === undefined) {
//         results.push({
//           status: 'Failed',
//           message: 'Missing required fields',
//         });
//         continue;
//       }

//       const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];

//       const existingGoal = await Goals.findOne({ 
//         employeeId, 
//         timePeriod,
//         'goals._id': goal.goalId 
//       });

//       if (!existingGoal) {
//         results.push({
//           status: 'Failed',
//           message: 'Goal not found for the given time period',
//         });
//         continue;
//       }

//       // const existingGoalData = existingGoal.goals.find(
//       //   g => g._id.toString() === goal.goalId);
//       const goals = await Goals.find({
//         employeeId,
//         'timePeriod.0': { $lte: endDate }, 
//         'timePeriod.1': { $gte: startDate }, 
//     });

//       if (!goals) {
//         results.push({
//           status: 'Failed',
//           message: 'Goal not found within the document',
//         });
//         continue;
//       }

//       if (managerWeightage > goals.weightage) {
//         results.push({
//           status: 'Failed',
//           message: 'Manager weightage must be less than or equal to the existing weightage',
//         });
//         continue;
//       }

//       // Update the managerWeightage
//       goals.managerWeightage = managerWeightage;
//       await existingGoal.save();

//       results.push({
//         message: 'Manager weightage updated successfully',
//         // data: {
//         //   goalId: existingGoal.goalId,
//         //   employeeId: existingGoal.employeeId,
//         //   empName: existingGoal.empName,
//         //   category: existingGoalData.category,
//         //   description: existingGoalData.description,
//         //   weightage: existingGoalData.weightage,
//         //   managerWeightage: existingGoalData.managerWeightage,
//         //   deadline: existingGoalData.deadline,
//         //   timePeriod: existingGoal.timePeriod,
//         // },
//         data: {
//           goalId: existingGoal.goalId,
//           employeeId: existingGoal.employeeId,
//           empName: existingGoal.empName,
//           empType: existingGoal.empType,
//           timePeriod: existingGoal.timePeriod,
//           goals: existingGoal.goals.map((goal) => ({
//             goalId: goal._id,
//             category: goal.category,
//             description: goal.description,
//             weightage: goal.weightage,
//             deadline: goal.deadline,
//             otherText: goal.otherText,
//             goalStatus: "Goals submitted"
//           })),
//         },
//       });
//     }

//     res.status(200).json(results);

//   } catch (error) {
//     console.error('Error in updating manager weights:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// 
const updateManagerGoalWeight = async (req, res) => {
  try {
    const { goals } = req.body;
    const { employeeId, startDate, endDate } = req.params;

    if (!Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ message: 'Goals array is required and cannot be empty' });
    }

    const results = [];

    for (const goal of goals) {
      const { managerWeightage } = goal;

      if (managerWeightage === undefined) {
        results.push({
          status: 'Failed',
          message: 'Manager weightage is required',
        });
        continue;
      }

      const timePeriod = [
        new Date(startDate).toISOString().split('T')[0],
        new Date(endDate).toISOString().split('T')[0],
      ];

      const existingGoal = await Goals.findOne({
        employeeId,
        timePeriod,
        'goals._id': goal.goalId,
      });

      if (!existingGoal) {
        results.push({
          status: 'Failed',
          message: 'Goal not found for the given time period',
        });
        continue;
      }

      const employeeGoals = await Goals.find({
        employeeId,
        'timePeriod.0': { $lte: endDate },
        'timePeriod.1': { $gte: startDate },
      });

      if (!employeeGoals || employeeGoals.length === 0) {
        results.push({
          status: 'Failed',
          message: 'No goals found for the employee in the given time period',
        });
        continue;
      }

      const goalData = existingGoal.goals.find(g => g._id.toString() === goal.goalId);
      if (managerWeightage > goalData.weightage) {
        results.push({
          status: 'Failed',
          message: 'Manager weightage must be less than or equal to the existing weightage',
        });
        continue;
      }

      goalData.managerWeightage = managerWeightage;
      await existingGoal.save();

      results.push({
        message: 'Manager weightage updated successfully',
        data: {
          employeeId: existingGoal.employeeId,
          empName: existingGoal.empName,
          empType: existingGoal.empType,
          timePeriod: existingGoal.timePeriod,
          goals: existingGoal.goals.map(g => ({
            goalId: g._id,
            category: g.category,
            description: g.description,
            weightage: g.weightage,
            deadline: g.deadline,
            otherText: g.otherText,
            GoalStatus: g.GoalStatus || "Goals Submitted",
            managerWeightage: g.managerWeightage, 
          })),
        },
      });
    }

    res.status(200).json({
      message: 'Manager weightage updated successfully',
      data: results.length > 0 ? results[0].data : {},
    });

  } catch (error) {
    console.error('Error in updating manager weights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// const fetchManagerGoalWeight = async (req, res) => {
//     try {
//         const { employeeId, startDate, endDate} = req.params;
//         if (!employeeId || !startDate || !endDate) {
//             return res.status(400).json({ message: 'Employee ID, start date, and end date are required' });
//         }

//         // const timePeriod = [new Date(startDate), new Date(endDate)];
//         const goals = await Goals.find( { 
//             employeeId,     
//             timePeriod: { 
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             },
//         }).select('_id weightage managerWeightage');

//         if (goals.length === 0) {
//             return res.status(404).json({ message: 'No goals found for the specified period.' });
//         }
//         res.status(200).json({ message: 'Goals retrieved successfully', data: goals });
//     } catch (error) {
//         console.error('Error in fetching goals:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }
// const fetchManagerGoalWeight = async (req, res) => {
//   try {
//       const { employeeId, startDate, endDate } = req.params;

//       if (!employeeId || !startDate || !endDate) {
//           return res.status(400).json({ message: 'Employee ID, start date, and end date are required' });
//       }

//       const timePeriod = [new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0]];

//       const goals = await Goals.find({
//           employeeId,
//           timePeriod: { $gte: timePeriod[0], $lte: timePeriod[1] },
//       }).select('_id weightage managerWeightage category description deadline');

//       if (goals.length === 0) {
//           return res.status(404).json({ message: 'No goals found for the specified period.' });
//       }

//       res.status(200).json({
//           message: 'Goals retrieved successfully',
          
//           data: goals.map((goal) => ({
//               goalId: goal._id,
//               category: goal.category,
//               description: goal.description,
//               weightage: goal.weightage,
//               managerWeightage: goal.managerWeightage,
//               deadline: goal.deadline,
//           })),
//       });
//   } catch (error) {
//       console.error('Error in fetching goals:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// };

const fetchManagerGoalWeight = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.params;

    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Employee ID, start date, and end date are required' });
    }

    const timePeriod = [
      new Date(startDate).toISOString().split('T')[0], 
      new Date(endDate).toISOString().split('T')[0]
    ];

    const employeeData = await Goals.findOne({
      employeeId,
      timePeriod: { $gte: timePeriod[0], $lte: timePeriod[1] }
    }).select('empName empType timePeriod goals'); 

    if (!employeeData || employeeData.goals.length === 0) {
      return res.status(404).json({ message: 'No goals found for the specified period.' });
    }

    const goalData = employeeData.goals.map((goal) => ({
      goalId: goal._id,
      category: goal.category,
      description: goal.description,
      weightage: goal.weightage,
      managerWeightage: goal.managerWeightage,
      deadline: goal.deadline,
    }));

    res.status(200).json({
      message: 'Goals retrieved successfully',
      data: {
        employeeId: employeeData.employeeId,
        empName: employeeData.empName,
        empType: employeeData.empType,
        timePeriod: employeeData.timePeriod,
        goals: goalData,
      },
    });

  } catch (error) {
    console.error('Error in fetching goals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { postEmployeeGoal, getEmployeeGoals, getGoalCategories, editGoal, updateManagerGoalWeight, fetchManagerGoalWeight };




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
