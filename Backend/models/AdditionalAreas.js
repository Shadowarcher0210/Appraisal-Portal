const mongoose = require('mongoose');

const AdditionalSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
    },
    quality: {
      type: String,
      required: [true, 'Quality is required'],
    },
    empName: {
      type: String,
      required: [true, 'Employee name is required'],
    },
    successMetric: {
      type: String,
      required: [true, 'Category is required'],
    },
   
    weightage: {
      type: Number,
      required: [true, 'Weightage is required'],
      min: [0, 'Weightage must be between 0 and 100'],
      max: [100, 'Weightage must be between 0 and 100'],
    },
    attainments: {
      type: Number,
      required: [true, 'Attainment is required'],
      min: [0, 'Attainment must be between 0 and 100'],
      max: [100, 'Attainment must be between 0 and 100'],
    },
    comments: {
      type: String,
      required: [true, 'Deadline date is required'],
    },
    timePeriod: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: 'Time period must contain exactly two dates (start and end).',
      },
      set: (dates) => {
        // Ensure dates are in YYYY-MM-DD format without the time part
        return dates.map((date) => new Date(date).toISOString().split('T')[0]);
      },
    },
  },
);

module.exports = mongoose.model('AdditionalAreas', AdditionalSchema);
