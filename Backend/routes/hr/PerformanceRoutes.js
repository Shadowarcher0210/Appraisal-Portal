const express = require('express');
const { getEmployeeAppraisals } = require('../../controllers/hr/Performance');
const router= express.Router();

router.get('/allAppraisals/:startDate/:endDate', getEmployeeAppraisals)
module.exports=router;