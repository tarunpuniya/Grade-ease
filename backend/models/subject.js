const mongoose = require('mongoose')
const subjectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    credits: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Subject", subjectSchema)