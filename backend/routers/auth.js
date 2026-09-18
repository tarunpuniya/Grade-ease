const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/authmiddleware')
const { studentsendotp , StudentverifyOtp , StudentCreatePassword , StudentLogin } = require('../controllers/authcontroller')

router.post('/student/send-otp',studentsendotp)
router.post('/student/verify-otp',StudentverifyOtp)
router.post('/student/create-password',StudentCreatePassword)
router.post('/student/login',StudentLogin)

router.get('/profile',authenticateToken,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"You are authenticated",
        user: req.user
    })
})

module.exports = router