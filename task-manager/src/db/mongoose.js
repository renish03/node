const mongoose=require('mongoose')
const validator=require('validator')
//const connectionURL="mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})

/*
const User=mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{
       type:String,
       minlength:7,
       trim:true,
       validate(value){
        if(value.includes('password')){
             throw new Error('do not include "password" word')   
        }
       } 
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate(value){
          if(!validator.isEmail(value)){
              throw new Error("Email is invalid")
          }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    
    }
})
const me=new User({"name":"rr ","email":"myRocket@gmail.com","password":"ttt "})
me.save().then(()=>{
    return console.log(me);
}).catch((error)=>{
    return console.log(error)
})
*/

/*
const Tasks=mongoose.model('Tasks',{
    desc:{
        type:String,

    },
    completed:{"type":Boolean}
})
const task=new Tasks({"desc":"clean room","completed":true})
task.save().then(()=>{
    return console.log(task);
}).catch((error)=>{
    return console.log(error)
})*/
