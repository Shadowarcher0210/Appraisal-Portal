const mongose = require('mongoose');

const goalsSchema = new mongose.Schema(
  {
    employeeId: {
        type: String,
        require: [true, 'employee Id is required'],
        unique: true
    },
    empName: {
      type: String,
      require: [true, 'emp name is required'],
    },
    category: {
      type: String,
      require: [true, 'category is required']
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
    timePeriod: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Time period must contain exactly two dates (start and end).'
      },
      set: (dates) => {
        // Ensure dates are in YYYY-MM-DD format without the time part
        return dates.map(date => new Date(date).toISOString().split('T')[0]);
      }
    }
  },)

module.exports = mongose.model('goals', goalsSchema)