const express=require('express')
const app=express()
require('./db/mongoose');
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

//const port=process.env.PORT||3000
const port=process.env.PORT
/*
app.use((req,res,next)=>{
    console.log('inside middleware');
    next()
})
*/
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server is running on port:'+port)
})

