const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require("dotenv")
const cors = require('cors')
const path = require('path')
const Dbconnection = require('./dataconnection')

dotenv.config()
Dbconnection()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



// Import routes
const authRoutes = require('./routers/auth')


// Register routes
app.use("/api/auth",authRoutes)




app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})