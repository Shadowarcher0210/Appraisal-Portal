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
  },)

module.exports = mongose.model('goals', goalsSchema)