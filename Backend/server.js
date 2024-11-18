const express = require('express');
const cors = require('cors');
const auth = require('./routes/auth')
const dotenv = require('dotenv').config();
const app = express(); 
const PORT = process.env.PORT || 3003;
const connectDb = require("./config/dbConnection");
const bodyParser = require('body-parser');

const formRoutes = require('./routes/appraisalRoutes'); 
const empRoutes = require('./routes/dashboardRouter')
const timePeriod  = require('./routes/timePeriod');
const performance = require('./routes/manager/PerformanceRoutes')
const EmployeeGoals = require('./routes/manager/GoalsRouter')
const uploadAppraisalLetter  = require('./routes/uploadRouter');
const sendConfirmationEmails = require('./routes/emailRouter');
const m_Dashboard = require('./routes/manager/DashboardRoutes')
const PerformanceHR = require('./routes/hr/PerformanceRoutes')

app.use(cors());
app.use(express.json());


app.use('/auth',auth)
app.use('/form', formRoutes)
app.use('/appraisal',performance)
app.use('/all', empRoutes)
app.use('/time',timePeriod)
app.use('/letter',uploadAppraisalLetter)
app.use('/goals',EmployeeGoals)
app.use('/confirmationEmail',sendConfirmationEmails)
app.use(m_Dashboard)
//HR
app.use('/appraisal',PerformanceHR)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


connectDb();

