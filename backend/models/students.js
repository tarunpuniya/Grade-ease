const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    rollno: {
        type: String,
        required: true,
        unique: true
    },

    semester: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Student", studentSchema)