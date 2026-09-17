const mongoose = require('mongoose')
const otpVerificationSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: ["signup", "forgot-password"],
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = mongoose.model("OtpVerification", otpVerificationSchema)