const mongoose = require('mongoose')


const gradeSchema = new mongoose.Schema({

    submissionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Submission",
        required:true

    },

    score:{
        type:Number,
        required:true
    },

    maxScore:{
        type:Number,
        required:true
    },

    feedback:{
        type:String
    },

    gradedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Teacher",
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    
    }
})

module.exports = mongoose.model("Grade",gradeSchema)