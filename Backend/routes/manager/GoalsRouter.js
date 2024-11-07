const express = require('express')
const { postEmployeeGoals, getEmployeeGoals } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId/:startDate/:endDate', postEmployeeGoals)
router.get('/:employeeId/:startDate/:endDate', getEmployeeGoals)

module.exports=router