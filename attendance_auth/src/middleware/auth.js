const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model')
require('dotenv').config()
const jwtSecretKey=process.env.JWTSECRETKEY

const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer','').trim()
        const decode=jwt.verify(token,jwtSecretKey)
        const user=await userModel.findOne({"_id":decode,"tokens.token":token})
        if(!user){
            throw new Error('not find');
        }
        req.user=user
        req.token=token
        next()
  }catch(error){
    res.status(401).send(error)
  }
}

module.exports=auth