const express = require('express')
const { postEmployeeGoal, getEmployeeGoal, editGoal } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId', postEmployeeGoal)
router.get('/:employeeId', getEmployeeGoal)
router.put('/editGoal/:employeeId/:goalId',editGoal)

module.exports=router