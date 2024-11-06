const express = require('express')
const { EmployeeGoals } = require('../../controllers/manager/Goals')

const router = express.Router()
router.post('/:employeeId', EmployeeGoals)

module.exports=router