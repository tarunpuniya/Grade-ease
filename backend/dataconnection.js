const mongoose = require('mongoose')
function Dbconnection(){
    const Db_url = process.env.mongo_url
    mongoose.connect(Db_url)
    const db = mongoose.connection
    db.on('error',console.error.bind(console,"connection error:"))
    db.once("open",function(){
        console.log("Database connected successfully")
     })   
}

module.exports = Dbconnection