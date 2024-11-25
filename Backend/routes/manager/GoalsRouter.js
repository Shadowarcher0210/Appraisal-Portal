const express = require('express')
const { getEmployeeGoals, editGoal, getGoalCategories, postEmployeeGoal, updateManagerGoalWeight, fetchManagerGoalWeight } = require('../../controllers/manager/Goals')

const router = express.Router()

router.post('/:employeeId/:startDate/:endDate', postEmployeeGoal)
router.get('/:employeeId/:startDate/:endDate', getEmployeeGoals)
router.put('/editGoal/:employeeId/:startDate/:endDate',editGoal)
router.get('/categories/:empType', getGoalCategories)
router.put('/managerWeight/:employeeId/:startDate/:endDate', updateManagerGoalWeight)
router.get('/managerWeight/:employeeId/:startDate/:endDate', fetchManagerGoalWeight)

module.exports = router
