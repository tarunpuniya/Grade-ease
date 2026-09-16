const express = require('express')
const app = express()
const dotenv = require("dotenv")
const Dbconnection = require('./dataconnection')

dotenv.config()
Dbconnection()

app.get('/',(req,res)=>{
    res.status(200).send("Server is perfectly running")
})


const PORT = 5674
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})