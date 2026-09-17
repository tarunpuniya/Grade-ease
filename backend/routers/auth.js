const express = require('express')
const router = express.Router()
const { studentsendotp , StudentverifyOtp , StudentCreatePassword } = require('../controllers/authcontroller')

router.post('/student/send-otp',studentsendotp)
router.post('/student/verify-otp',StudentverifyOtp)
router.post('/student/create-password',StudentCreatePassword)

module.exports = router