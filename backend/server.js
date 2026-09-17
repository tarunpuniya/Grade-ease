const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require("dotenv")
const Dbconnection = require('./dataconnection')

dotenv.config()
Dbconnection()

// Middleware
app.use(express.json())

// Import routes
const authRoutes = require('./routers/auth')


// Register routes
app.use("/api/auth",authRoutes)

app.get('/',(req,res)=>{
    res.status(200).send("Server is perfectly running")
})

const PORT = 5674
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})