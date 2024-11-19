const express = require('express')
const { getEmployeeGoal, editGoal, getEmployeeGoal2, postEmployeeGoal } = require('../../controllers/manager/Goals')

const router = express.Router()

router.post('/:employeeId/:startDate/:endDate', postEmployeeGoal)
router.get('/:employeeId/:startDate/:endDate', getEmployeeGoal)
router.put('/editGoal/:employeeId/:startDate/:endDate',editGoal)
router.get('/categories/:empType', getEmployeeGoal2)


module.exports=router
