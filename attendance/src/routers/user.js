const router=require('express').Router()
const userModel=require('../models/user.model')

router.get('/',(req,res)=>{
    res.send('Welcome to Homepage!!')
})

router.post('/users',async (req,res)=>{
    try{
      const user=new userModel(req.body)
      await user.save()
      res.status(200).send(user)
    }catch(error){
      res.status(400).send(error)
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
            
               //console.log(data2);
           }) 
           data.totpunchhour=parseFloat(hour /(3600*1000)).toFixed(4)   
       })

        res.status(200).send(users)
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/:id/punchin',async (req,res)=>{
    try{
        const punchdata={"punchin":Date.now()}
        const user=await userModel.findById(req.params.id)
        user.punch.push(punchdata)
        await user.save()
        res.status(200).send(user)
        
    }catch(error){
        res.status(400).send(error)
    }
    
})

router.post('/users/:id/punchout',async (req,res)=>{
    try{
        const user=await userModel.findById(req.params.id)
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

router.patch('/users/:id',async (req,res)=>{
    try{
       const updatedKeys=Object.keys(req.body)
       const allowedUpdate=["name","email","password"] 
       const isAllowed=updatedKeys.every(update=>{
           return allowedUpdate.includes(update)
       })
       if(!isAllowed){
           throw new Error('provide valid field to update')
       }
       const user=await userModel.findById(req.params.id);
       updatedKeys.forEach(data=>{
           user[data]=req.body[data]
       })
       await user.save()
       res.status(200).send(user)
       
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/:id',async (req,res)=>{
    try{
        const user=await userModel.findByIdAndDelete(req.params.id)
        res.status(200).send(user)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports=router