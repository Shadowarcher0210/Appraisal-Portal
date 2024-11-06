const express = require('express')
const { getEmployeesForManager } = require('../../controllers/manager/Dashboard')

const router = express.Router()
router.get('/employees/:managerName', getEmployeesForManager)
module.exports=router