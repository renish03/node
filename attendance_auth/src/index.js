const express=require('express')
const app=express()
const mypath=require('path');
const cpath= mypath.join(__dirname,"../")

require('dotenv').config({ path: cpath + '/.env' })
const port=process.env.PORT
require('./db/mongoose')

const userRouter=require('./routers/user')

app.use(express.json())
app.use('/',userRouter)

app.listen(port,()=>{
    console.log(`Server is runing at port: ${port}`)
})