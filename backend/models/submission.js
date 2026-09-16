const mongoose = require('mongoose')
const submissionSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },

    filepath: {
        type: String,
        required: true
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Submission", submissionSchema)