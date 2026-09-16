const mongoose = require('mongoose')

const feesSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student" 
    },
    total:{
        type:Number,
        required:true
    },
    paid:{
        type:Number,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model("fees",feesSchema)