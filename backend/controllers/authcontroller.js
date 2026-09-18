const Student = require('../models/students')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {generateOTP} = require('../utils/otpGenerator')
const {sendEmail} = require('../utils/mailer')
const Otpverification = require('../models/otpverification')

// OTP send process 
exports.studentsendotp = async(req,res)=>{
    try{
        const {email} = req.body

        const student = await Student.findOne({email})
        if(!student) return res.status(401).send("Student not found")
        if(student.isVerified) return res.status(400).send("Acount already activated Please login")
        
        const otp = generateOTP()

        await Otpverification.create({
            email,
            otp,
            purpose: "signup",
            expiresAt: new Date(Date.now()+5*60*1000)
        })

        await sendEmail (
            email,
            "Your signup otp",
            `Your otp is ${otp}. It will expire in 5 min`
        )
        return res.status(200).json({
            success:true,
            message:"otp sent successfully"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}
 

// verify otp 

exports.StudentverifyOtp = async(req,res)=>{
    try{
        const {email,otp} = req.body
        const otpRecord = await Otpverification.findOne({
            email,
            purpose:"signup",
            verified:false,
        }).sort({createdAt: -1})

        if(!otpRecord){
            return res.status(400).send("otp not found")
        }

        if(otpRecord.expiresAt < new Date()){
            return res.status(400).send("otp expired")
        }
        if(otpRecord.otp!==otp){
            return res.status(400).send("Invalid otp")
        }

        otpRecord.verified=true
        await otpRecord.save()
        return res.status(200).send("OTP verified successfully")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}

// student create password

exports.StudentCreatePassword = async(req,res)=>{
    try{
        const {email,password} = req.body
        const student = await Student.findOne({email})
        if(!student){
            return res.status(400).send("student not found")
        }

        const otpRecord = await Otpverification.findOne({
            email,
            purpose:"signup",
            verified:true
        }).sort({createdAt: -1})

        if(!otpRecord){
            return res.status(400).send("Please verify otp first")
        }
        if(student.isVerified){
            return res.status(400).send("Already activated please login")
        }

        // Hash password
        const hashedpassword = await bcrypt.hash(password , 10)
        student.password = hashedpassword
        student.isVerified = true
        await student.save()

        await Otpverification.deleteOne({
            _id: otpRecord._id
        })
        return res.status(200).send("Account activated successfull")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("internal server error")
    }
}

// student login

exports.StudentLogin = async(req,res)=>{
    try{
        const {email , password} = req.body
        const student = await Student.findOne({email})
        if(!student){
            return res.status(400).send("student not found")
        }
        if(!student.isVerified){
            return res.status(403).send("Account not activated please verify otp and create password")
        }
        const isPasswordMatch = await bcrypt.compare(password,student.password)
        if(!isPasswordMatch){
            return res.status(401).send("Invalid password")
        }

        const token = jwt.sign({
            id: student._id,
            email: student.email,
            role: "student"
        }, process.env.JWT_SECRET,{
            expiresIn: "1d"
        })
        return res.status(200).json({
            success:true,
            message:"Login successful",
            token
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Internal server error")
    }
}