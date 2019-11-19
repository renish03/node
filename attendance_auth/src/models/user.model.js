const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const jwtSecretKey=process.env.JWTSECRETKEY

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
    }],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

},{timestamps:true})

userSchema.statics.findByCred=async (email,password)=>{
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Email is not available')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Incorrect email/password')
    }
    return user;
}

userSchema.methods.generateAuthToken=async function(){
    //console.log('key'+jwtSecretKey)
    const user=this
    const token=jwt.sign({_id:user._id.toString()},jwtSecretKey)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token;
}

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,8)
    next();
})

const User=mongoose.model("User",userSchema)

module.exports=User;