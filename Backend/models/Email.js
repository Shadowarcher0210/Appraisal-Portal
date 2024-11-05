const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    empName: { type: String, required: true },
    email: { type: String, required: true },
    managerName: { type: String, required: true },
    managerEmail: { type: String, required: true },
    department: { type: String, required: true },
    submitted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', EmailSchema);
