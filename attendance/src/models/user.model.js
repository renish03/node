const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=mongoose.Schema({
    "name":{
        type:String,
        required:true,
        trim:true
    },
    "email":{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email!!')
            }
        }
    },
    "password":{
        type:String,
        required:true,
        minlength:7
    },
    "punch":[{
        "punchdate":{
            type:Date,
            default:Date.now
        },
        "punchin":{
            type:Date,
        },
        "punchout":{
            type:Date
        }
    }]

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,8)
    next();
})

const User=mongoose.model("User",userSchema)

module.exports=User;