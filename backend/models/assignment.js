const mongoose = require('mongoose')
const assignmentSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    maxMarks: {
        type: Number,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Assignment", assignmentSchema)