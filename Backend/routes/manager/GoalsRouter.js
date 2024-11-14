const express = require('express')
const { postEmployeeGoal, getEmployeeGoal, editGoal, getEmployeeGoal2 } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId', postEmployeeGoal)
router.get('/:employeeId', getEmployeeGoal)
router.get('/categories/:employeeId', getEmployeeGoal2)
router.put('/editGoal/:employeeId/:goalId',editGoal)

module.exports=router