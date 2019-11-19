const mongoose=require('mongoose')
require('dotenv').config()

//const url="mongodb://127.0.0.1:27017/attendance"
const url=process.env.MONGODB_URL
mongoose.connect(url,{useNewUrlParser:true})