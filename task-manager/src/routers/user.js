const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const sharp = require('sharp')
const multer=require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router=new express.Router()

router.get("/users/me",auth,async (req,res)=>{
    res.send(req.user)
    
})

router.post("/users",async (req,res)=>{
    //console.log(req.body);
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
        
    }catch(error){
        res.status(400).send(error);
    } 
    /*
    const user=new User(req.body)
    user.save().then(()=>{
        res.send(user);
    }).catch((error)=>{
        res.status(400).send(error);
        //res.send(error);
    })
    //res.send('test');
    */
})


router.get("/users",async (req,res)=>{
    //console.log(req.body);
    try{
        const users=await User.find({})
        res.send(users);
    }catch(error){
        res.status(500).send()
    }

})

router.get("/users/:id",async (req,res)=>{
    //console.log(req.body);
    const _id=req.params.id
    try{
       const users=await  User.findById(_id)
       if(!users){
        return res.status(400).send()
       }
       res.send(users);
    }catch(error){
        res.status(500).send()
    }
    /*
    User.findById(_id).then((users)=>{
        if(!users){return res.status(400).send()}
        res.send(users);
    }).catch((e)=>{
        res.status(500).send()
    })*/   
})

router.patch('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!validOperation){
        res.status(400).send('error:Invalid updates!!') 
    }

    try{
       updates.forEach((update)=>req.user[update]=req.body[update])
       await req.user.save();
      //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      res.send(req.user);

    }catch(error){
        res.status(400).send(error)
   }
})
/*
router.patch('/users/:id',async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const validOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!validOperation){
        res.status(400).send('error:Invalid updates!!') 
    }

    try{
       const user=await User.findById(req.params.id)
       updates.forEach((update)=>user[update]=req.body[update])
       await user.save();

      //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      if(!user){
        res.status(400).send()
      }  
      res.send(user);

    }catch(error){
        res.status(400).send(error)
   }

})*/

/*
router.delete('/users/:id',auth,async (req,res)=>{
    try{
     const user=await User.findByIdAndDelete(req.params.id)
     if(!user){
         return  res.status(400).send(error)
     }   
     res.send(user);
    }catch(error){
        res.status(400).send(error)
    }
})
*/
router.delete('/users/me',auth,async (req,res)=>{
    try{
     await req.user.remove()   
     res.send(req.user);
    }catch(error){
        res.status(400).send(error)
    }
})


router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()

        if(!user){
            return  res.status(400).send('unable to login')
        }   
        res.send({user,token});
    }catch(error){
        res.status(400).send(error)
    }
    
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
     req.user.tokens=req.user.tokens.filter((token)=>{
         return token.token!==req.token
     })
     await req.user.save();
     res.status(200).send('Sucessfully Logout..')
    }catch(error){
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
     req.user.tokens=[];
     await req.user.save();
     res.status(200).send('Sucessfully Logout from AllDevice..')
    }catch(error){
        res.status(500).send(error)
    }
})
/*
const upload=multer({
    dest:'avatars',
    limits:{
        filesize:1000000
    },fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }

})
*/


const upload=multer({
    limits:{
        filesize:1000000
    },fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar=buffer
    //req.user.avatar=req.file.buffer
    await req.user.save()
    res.send('file uploaded')
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }

})



module.exports=router

