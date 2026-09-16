const mongoose = require('mongoose')
const programSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Program", programSchema)