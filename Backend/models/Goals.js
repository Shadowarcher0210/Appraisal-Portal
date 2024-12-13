const mongoose = require('mongoose');

const goalContent = new mongoose.Schema(
  {
    category: {
      type: String,
      require: [true, 'category is required']
    },
    otherText: {
      type: String,
      // require: [true, 'otherText is required']
    },
    description: {
      type: String,
      require: [true, 'description is required'],
    },
    weightage: {
      type: Number,
      required: [true, 'weightage is required'],
    },
    deadline: {
      type: String,
      required: [true, 'deadline date is required'],
    },
    managerWeightage:{
      type: Number
    },
   
  },)

  const goalsSchema = new mongoose.Schema({
    
    employeeId: {
        type: "string",
        ref: 'User',
        required: true
    },
    empName: {
        type: 'string',
        required: true
    },
    empType: {
      type: String,
      require: [true, 'user type is required'],
      default: 'Employee',
      enum: ['HR', 'Manager', 'Employee'],
    },
    timePeriod: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Time period must contain exactly two dates (start and end).'
      },
      set: (dates) => {
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      }
    },

    goals: {
        type: [goalContent],
        default: []
    },
    GoalStatus: {
      type: String,
      require: [true, 'GoalStatus is required'],
  },
    overallGoalScore: {
        type: Number,
        default: null
    },

});


module.exports = mongoose.model('goals', goalsSchema)