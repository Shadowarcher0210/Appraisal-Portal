const mongoose = require("mongoose");

const AdditionalSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: [true, "Quality is required"],
  },
  successMetric: {
    type: String,
    required: [true, "SuccessMetric is required"],
  },
  weightage: {
    type: Number,
    required: [true, "Weightage is required"],
  },
  attainments: {
    type: Number,
    min: [0, "Attainment must be between 0 and 100"],
    max: [100, "Attainment must be between 0 and 100"],
  },
  comments: {
    type: String,
    default: "",
  },
});

const AdditionalAreaSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, "Employee ID is required"],
  },
  timePeriod: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 2;
      },
      message: "Time period must contain exactly two dates (start and end).",
    },
  },
  areas: {
    type: [AdditionalSchema],
    required: [true, "Areas are required"],
  },
  overallScore: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("AdditionalAreas", AdditionalAreaSchema);
