require('../src/db/mongoose')
const User=require('../src/models/user')

// 5da8df75fe3f2b15f4ff82b5
/*
User.findByIdAndUpdate('5da8e0444ee86312809a18ac',{"age":1}).then((user)=>{
    console.log(user);
    return User.countDocuments({"age":1})
}).then((result)=>{
    console.log(result);
}).catch((e)=>{
    console.log(e);
})
*/
// Async/Await

const updateAgeAndCount=async (id,age)=>{
 const user=await User.findByIdAndUpdate(id,{age});
 const count=await User.countDocuments({age})
 return count;
}

updateAgeAndCount('5da8e0444ee86312809a18ac',2).then((count)=>{
   console.log(count)
}).catch((e)=>{
    console.log(e)
})
