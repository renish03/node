const mongoose=require('mongoose')
const validator=require('validator')
//require('../db/mongoose');
const taskSchema=mongoose.Schema({
    desc:{
        "type":String
    },
    completed:{"type":Boolean},
    owner:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref: 'User'    
    }
},{timestamps:true})

const Task=mongoose.model('Task',taskSchema)

module.exports=Task

/*
const task=new Tasks({"desc":"clean room","completed":true})
task.save().then(()=>{
    return console.log(task);
}).catch((error)=>{
    return console.log(error)
})*/
