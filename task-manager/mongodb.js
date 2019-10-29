const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectId=mongodb.ObjectID;

const connectionURL="mongodb://127.0.0.1:27017";
const databaseName="task-manager"
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("unable to connect database!!")
    }
    //console.log("connected Successfully")
    const db=client.db(databaseName);
   /* db.collection('users').insertOne({'name':'raj','age':37},(error,result)=>{
        if(error){console.log('unable to insert user')}
        else{
            console.log(result.ops);
        }
    })*/
   /* db.collection('users').insertMany([{'name':'jen','age':25},{'name':'rahul','age':28}],(error,result)=>{
        if(error){console.log('unable to insert user')}
        else{
            console.log(result.ops);
        }
    })*/
   /* db.collection('tasks').insertMany([{'desc':'clean house','completed':true},{'desc':'receive inspection','completed':false}],(error,result)=>{
        if(error){console.log('unable to insert user')}
        else{
            console.log(result.ops);
        }
    })*/

    // search
    /*db.collection('users').find({"name":"raj"},(error,result)=>{
        if(error){console.log('coul not find')}
        else{
            console.log(result);
        }
    })*/
    /*
    db.collection('users').find({"name":"raj"}).toArray((error,result)=>{
        if(error){return console.log("could not find")}
        else{
            console.log(result);
        }
    })
    */
    /*db.collection('users').find({"name":"raj"}).count((error,result)=>{
        if(error){return console.log("could not find")}
        else{
            console.log(result);
        }
    })*/
    // update
    /*
    db.collection('users').updateOne({"_id":ObjectId("5da888fa5e39b50828c770db")},{
        $set:{"name":"renish"}
    }).then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    })
    */
   db.collection('users').deleteMany({"name":"rahul"}
   
   ).then((result)=>{
        console.log(result);
   }).catch((error)=>{
    console.log(error);
   })
})