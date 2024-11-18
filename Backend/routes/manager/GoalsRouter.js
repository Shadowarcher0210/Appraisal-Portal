const express = require('express')
const {  postEmpGoals, getEmpGoals, editGoals, getEmployeeGoal2 } = require('../../controllers/manager/Goals')

const router = express.Router()
// router.post('/:employeeId', postEmployeeGoal)
//router.get('/:employeeId', getEmployeeGoal)
// router.post('/:employeeId', postEmployeeGoal)
// router.get('/:employeeId', getEmployeeGoal)
// router.put('/editGoal/:employeeId/:goalId',editGoal)

router.post('/:employeeId/:startDate/:endDate', postEmpGoals)
router.get('/:employeeId/:startDate/:endDate', getEmpGoals)
router.put('/editGoal/:employeeId/:startDate/:endDate',editGoals)
router.get('/categories/:empType', getEmployeeGoal2)


module.exports=router
