require('../src/db/mongoose')
const Task=require('../src/models/task')

/*
Task.findByIdAndDelete('5da8e54a401db31a24101d7f').then((task)=>{
    console.log(task);
    return Task.countDocuments({"completed":false})
}).then((result)=>{
    console.log(result);
}).catch((e)=>{
    console.log(e);
})
*/

const taskFindAndDelete=async (id)=>{
  const user=Task.findByIdAndDelete(id)
  const count=Task.countDocuments({"completed":true})
  return count;
}

taskFindAndDelete('5da8e47055fc5218506b4539').then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})
