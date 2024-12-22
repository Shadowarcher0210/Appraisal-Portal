const mongoose = require("mongoose");

const overallWeightageSchema = new mongoose.Schema({
  employeeId: {
    type: "string",
    ref: "User",
    required: true,
  },
  timePeriod: {
    type: [Date],
    validate: {
      validator: function (v) {
        return v.length === 2;
      },
      message: "Time period must contain exactly two dates (start and end).",
    },
  },
  overallWeightage: {
    type: Number,
    required: true,
  },
  performanceRating:{
    type: String,
    required: true,
  },
  areasOfGrowth:{
    type: String,
  },
  summary:{
    type: String,
  }
});

module.exports = mongoose.model("OverallWeightage",overallWeightageSchema);
