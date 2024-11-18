const express = require('express')
const { postEmployeeGoal, getEmployeeGoal, editGoal, getEmployeeGoal2 } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId/:startDate/:endDate', postEmployeeGoal)
router.get('/:employeeId/:startDate/:endDate', getEmployeeGoal)
router.get('/categories/:empType', getEmployeeGoal2)
router.put('/editGoal/:employeeId/:goalId',editGoal)

module.exports=router