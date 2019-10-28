const request = require('request')

const forecast=(longitute,latitute,callback)=>{
    const url="https://api.darksky.net/forecast/7bb22c58271538f99a759d000b978c4a/"+longitute+","+latitute+"?units=si";
    request({url:url,json:true},(error,{ body })=>{
     if(error){
         callback("not able to connect weather service",undefined)
         
     }else if(body.error){
         callback("not able to find search location",undefined)
        
     }else{
        
         //callback(undefined,{"summary":data.daily.data[0].summary,"temprature":data.currently.temperature,"Probability":data.currently.precipProbability})
        callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degress out. There is a ' + body.currently.precipProbability + '% chance of rain.')
     }
     
  }) 
 }
 


 module.exports=forecast;