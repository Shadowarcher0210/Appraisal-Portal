const express = require('express')
const { editGoal, postEmpGoals, getEmpGoals, editGoals } = require('../../controllers/manager/Goals')

const router = express.Router()
// router.post('/:employeeId', postEmployeeGoal)
router.post('/:employeeId/:startDate/:endDate', postEmpGoals)
// router.get('/:employeeId', getEmployeeGoal)
router.get('/:employeeId/:startDate/:endDate', getEmpGoals)

router.put('/editGoal/:employeeId/:goalId',editGoal)
router.put('/editGoal/:employeeId/:startDate/:endDate',editGoals)

module.exports=router
