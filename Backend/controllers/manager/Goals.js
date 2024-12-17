const Goals = require('../../models/Goals');
const User = require('../../models/User');

const postEmployeeGoal = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.params;
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

    }));
    console.log("Goal Content Array:", goalContentArray);

    const newGoalDocument = new Goals({
      employeeId,
      empName,
      empType,
      timePeriod,
      goals: goalContentArray,
      GoalStatus: "Goals Submitted",
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
        GoalStatus: goal.GoalStatus,
      })),
    });

  } catch (error) {
    console.error('Error in creating goals:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEmployeeGoals = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.params;
    const goals = await Goals.find({
      employeeId,
      $expr: {
        $and: [
          { $gte: [{ $arrayElemAt: ["$timePeriod", 0] }, new Date(startDate)] },
          { $lte: [{ $arrayElemAt: ["$timePeriod", 1] }, new Date(endDate)] }
        ]
      },
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

    const employeeOtherTexts = employeeGoals.flatMap(goalDoc =>
      goalDoc.goals
        .filter(goal => goal.category === 'Others' && goal.otherText)
        .map(goal => goal.otherText)
    );

    let categories = [...new Set([...predefinedCategories, ...employeeOtherTexts])];

    if (!categories.includes('Others')) {
      categories.push('Others');
    }

    console.log("categories", categories);

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


const updateManagerGoalWeight = async (req, res) => {
  try {
    const { goals, overallGoalScore } = req.body;
    const { employeeId, startDate, endDate } = req.params;

    if (!Array.isArray(goals) || goals.length === 0) {
      return res
        .status(400)
        .json({ message: 'Goals array is required and cannot be empty' });
    }

    const results = [];
    const timePeriod = [
      new Date(startDate).toISOString().split('T')[0],
      new Date(endDate).toISOString().split('T')[0],
    ];

    const existingGoals = await Goals.findOne({
      employeeId,
      timePeriod,
    });

    if (!existingGoals) {
      return res.status(404).json({
        message: 'No goals found for the employee in the given time period',
      });
    }

    for (const goal of goals) {
      const { managerWeightage, goalId } = goal;

      if (managerWeightage === undefined) {
        results.push({
          status: 'Failed',
          message: 'Manager weightage is required',
        });
        continue;
      }

      const goalData = existingGoals.goals.find((g) => g._id.toString() === goalId);
      if (!goalData) {
        results.push({
          status: 'Failed',
          message: `Goal with ID ${goalId} not found`,
        });
        continue;
      }

      if (managerWeightage > goalData.weightage) {
        results.push({
          status: 'Failed',
          message: 'Manager weightage must be less than or equal to the existing weightage',
        });
        continue;
      }

      goalData.managerWeightage = managerWeightage;
    }

    existingGoals.overallGoalScore = overallGoalScore;

    await existingGoals.save();

    results.push({
      status: 'Success',
      message: 'Manager weightages and overall score updated successfully',
      data: {
        employeeId: existingGoals.employeeId,
        empName: existingGoals.empName,
        empType: existingGoals.empType,
        timePeriod: existingGoals.timePeriod,
        overallGoalScore: existingGoals.overallGoalScore,
        goals: existingGoals.goals.map((g) => ({
          goalId: g._id,
          category: g.category,
          description: g.description,
          weightage: g.weightage,
          deadline: g.deadline,
          otherText: g.otherText,
          goalStatus: g.goalStatus || 'Goals Submitted',
          managerWeightage: g.managerWeightage,
        })),
      },
    });

    res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.error('Error in updating manager weights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const fetchManagerGoalWeight = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.params;

    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Employee ID, start date, and end date are required'
      });
    }

    const start = Date.parse(startDate);
    const end = Date.parse(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        message: 'Invalid date format. Please provide valid dates for start and end.'
      });
    }

    const timePeriod = [
      new Date(startDate).toISOString().split('T')[0],
      new Date(endDate).toISOString().split('T')[0]
    ];


    const existingGoals = await Goals.findOne({
      employeeId,
      timePeriod
    });


    if (!existingGoals) {
      return res.status(404).json({
        message: 'No goals found for the employee in the given time period'
      });
    }


    const responseData = {
      employeeId: existingGoals.employeeId,
      empName: existingGoals.empName,
      empType: existingGoals.empType,
      timePeriod: existingGoals.timePeriod,
      overallGoalScore: (existingGoals.overallGoalScore || 0).toFixed(2),
      goals: existingGoals.goals.map((goal) => ({
        goalId: goal._id,
        category: goal.category,
        description: goal.description,
        weightage: goal.weightage,
        deadline: goal.deadline,
        otherText: goal.otherText,
        goalStatus: goal.goalStatus || 'Goals Submitted',
        managerWeightage: goal.managerWeightage !== undefined ? goal.managerWeightage : null
      }))
    };

    res.status(200).json({
      data: responseData
    });

  } catch (error) {
    console.error('Error in retrieving manager goals:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};



module.exports = { postEmployeeGoal, getEmployeeGoals, getGoalCategories, editGoal, updateManagerGoalWeight, fetchManagerGoalWeight };