const request=require("request")
const forecast=require("./utils/forecast");
const geocode=require("./utils/geocode");
// philadelphia
geocode('mumbai',(error,{Longitute,Latitute,Place})=>{
    if(error){
        return console.log(error);
    }
    //console.log(response);
    
    forecast(Longitute,Latitute,(error,forecastdata)=>{
        if(error){
             return console.log(error);   
        }
        console.log(Place);
        console.log(forecastdata);
    })
    
})
// run:node app.js
/*
forecast('37.8267','-122.4233',(error,response)=>{
        console.log(error);
        console.log(response);
    })
*/


