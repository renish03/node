const router=require('express').Router()
const userModel=require('../models/user.model')
const auth=require('../middleware/auth')
const jwt=require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const jwtSecretKey=process.env.JWTSECRETKEY

router.get('/',(req,res)=>{
    res.send('Welcome to Homepage!!')
})

router.post('/users',[
    check('email').isEmail().withMessage('kindly provide valid email id'),
    // password must be at least 5 chars long
    check('password').isLength({ min: 7 })
    ],async (req,res)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
      }
      const user=new userModel(req.body)
      await user.save()
      res.status(200).send(user)
    }catch(error){
      res.status(400).send(error)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        
      const user=await userModel.findByCred(req.body.email,req.body.password)
      const token=await user.generateAuthToken();
      if(!user){
        return  res.status(400).send('unable to login')
      } 
      res.status(200).send({user,token});
     
    }catch(error){
      res.status(400).send(error)
    }
})

router.get('/users/sdate/:sdate/:edate',auth,async (req,res)=>{
    try{
        let edate=req.params.edate
        if(!edate){
            edate=req.params.sdate
        }
        
        const userid=req.user._id;
        const user=await userModel.find({"_id":userid,"punch.punchdate":{
            $gte:new Date(new Date(req.params.sdate).setHours(00, 00, 00))
            ,$lte:new Date(new Date(edate).setHours(23, 59, 59))
           }
        }).lean()
          
        user.forEach(data=>{
            let hour=0;
            data.punch.forEach(data2=>{
                hour=hour+(data2.punchout.getTime()-data2.punchin.getTime())
                data2.punchhour=(data2.punchout.getTime()-data2.punchin.getTime())/(1000*3600);   
                            
            }) 
            hours=parseFloat(hour /(3600*1000)).toFixed(4)
            data.tothour=hours;  
        })
        
        res.status(200).send(user);    
    }catch(error){
        res.status(400).send(error);
    }
    
})

router.get('/users/me',auth,async (req,res)=>{
    try{
        
        const users=req.user.toObject()
            let hour=0;
            users.punch.forEach(data2=>{
            hour=hour+(data2.punchout.getTime()-data2.punchin.getTime())
            //data2.punchhour=(data2.punchout.getTime()-data2.punchin.getTime())/(1000*3600);   
                        
           }) 
           hours=parseFloat(hour /(3600*1000)).toFixed(4)   
                    
        res.status(200).send({users,hours});
    }catch(error){
        res.status(400).send(error);
    }
})

router.get('/users',async (req,res)=>{
    try{
       
        const sort={}
        let limit = req.query.limit;
        let skip=req.query.skip;
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
       
        const users=await userModel.find().limit(parseInt(limit)).skip(parseInt(skip)).sort(sort).lean()
        users.forEach(data=>{
            let hour=0;
            data.punch.forEach(data2=>{
            hour=hour+(data2.punchout.getTime()-data2.punchin.getTime())
            data2.punchhour=(data2.punchout.getTime()-data2.punchin.getTime())/(1000*3600);   
                        
           }) 
           data.totpunchhour=parseFloat(hour /(3600*1000)).toFixed(4)   
       })

        res.status(200).send(users)
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/me/punchin',auth,async (req,res)=>{
    try{
        const punchdata={"punchin":Date.now()}
        const user=req.user
        
        user.punch.push(punchdata)
        await user.save()
        res.status(200).send(user)
        
    }catch(error){
        res.status(400).send(error)
    }
    
})

router.post('/users/me/punchout',auth,async (req,res)=>{
    try{
        const user=req.user
        if(user.punch && user.punch.length>0){
            const lastpunch=user.punch[user.punch.length-1]
            lastpunch.punchout=Date.now();
            await user.save()
            res.status(200).send(user)
        }else{
            res.status(400).send('there is no punchin time!!');
        }
        
    }catch(error){
        res.status(400).send(error)
    }
    
})

router.patch('/users/me',auth,async (req,res)=>{
    try{
       const updatedKeys=Object.keys(req.body)
       const allowedUpdate=["name","email","password"] 
       const isAllowed=updatedKeys.every(update=>{
           return allowedUpdate.includes(update)
       })
       if(!isAllowed){
           throw new Error('provide valid field to update')
       }
       const user=req.user
       updatedKeys.forEach(data=>{
           user[data]=req.body[data]
       })
       await user.save()
       res.status(200).send(user)
       
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/me',async (req,res)=>{
    try{
        await req.user.remove()  
        res.status(200).send(req.user)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports=router