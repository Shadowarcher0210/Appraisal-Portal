const express = require('express')
const { getEmployeeGoal, editGoal, getEmployeeGoal2, postEmployeeGoal, updateManagerGoalWeight } = require('../../controllers/manager/Goals')

const router = express.Router()

router.post('/:employeeId/:startDate/:endDate', postEmployeeGoal)
router.get('/:employeeId/:startDate/:endDate', getEmployeeGoal)
router.put('/editGoal/:employeeId/:startDate/:endDate',editGoal)
router.get('/categories/:empType', getEmployeeGoal2)
router.put('/managerWeight/:employeeId/:startDate/:endDate', updateManagerGoalWeight)

module.exports = router
