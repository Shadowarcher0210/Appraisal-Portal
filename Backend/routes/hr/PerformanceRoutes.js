const express = require('express');
const { getEmployeeAppraisals, getAllEmployees } = require('../../controllers/hr/Performance');
const router= express.Router();

router.get('/allAppraisals/:startDate/:endDate', getEmployeeAppraisals)
router.get('/allEmployees',getAllEmployees)

module.exports=router;