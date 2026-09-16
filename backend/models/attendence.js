const mongoose = require('mongoose')

const attendenceSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },

    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },

    date:{
        type:Date,
        required:true
    },

    present:{
        type:Boolean,
        default:true
    },

    timeStamp:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Attendence",attendenceSchema)