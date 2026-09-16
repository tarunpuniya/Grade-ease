const mongoose = require('mongoose')
const enrollmentSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    }

})
module.exports = mongoose.model("Enrollment", enrollmentSchema)