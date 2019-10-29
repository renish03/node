const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async (req,res,next) =>{
    try{
        const token=req.header('Authorization').replace('Bearer','').trim()
        //return console.log(token);
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findOne({_id:decoded,'tokens.token':token})
        if(!user){
            throw new Error('not find');
        }
        req.token=token;
        req.user=user;
        next()
    }catch(error){
        res.status(401).send(error)
        //res.status(401).send({error:'please authanticate'})
    }
}

module.exports=auth
