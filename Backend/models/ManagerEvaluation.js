const mongoose = require('mongoose');

const managerevaluationschema = new mongoose.Schema({
    employeeId: {
        type: "string",
        ref: 'User',
        required: true
    },
timePeriod: {
    type: [Date],
    validate: {
        validator: function (v) {
            return v.length === 2;
        },
        message: 'Time period must contain exactly two dates (start and end).'
    }
},
managerName: {
    type: String,
    require: [true, 'Manager Name is required']
  },
managerRating :{
    type: Number,
    required :[true,'managerRating is Required']
},
convertedRating :{
    type: Number,
    required :[true,'overallRating is Required']
},
additionalComments : {
    type : String,
    // required :[true,'managercomments is Required']
    default: null,
}

})

module.exports = mongoose.model("ManagerEvaluation",managerevaluationschema)