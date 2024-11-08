const express = require('express')
const { postEmployeeGoal, getEmployeeGoal } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId', postEmployeeGoal)
router.get('/:employeeId', getEmployeeGoal)

module.exports=router