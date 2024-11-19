const mongose = require('mongoose');

const goalsSchema = new mongose.Schema(
  {
    employeeId: {
        type: String,
        require: [true, 'employee Id is required'],
    },
    empName: {
      type: String,
      require: [true, 'emp name is required'],
    },
    category: {
      type: String,
      require: [true, 'category is required']
    },
    otherText: {
      type: String,
      require: [true, 'otherText is required']
    },
    description: {
      type: String,
      require: [true, 'description is required'],
    },
    weightage: {
      type: String,
      required: [true, 'weightage is required'],
    },
    deadline: {
      type: String,
      required: [true, 'deadline date is required'],
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
    }
  },)

module.exports = mongose.model('goals', goalsSchema)