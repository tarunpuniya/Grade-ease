const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.status(200).send("Server is perfectly running")
})


const PORT = 5674
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})