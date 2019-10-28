const request=require("request")

const geocode=(address,callback)=>{
    const geocodeURL="https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(address)+".json?access_token=pk.eyJ1IjoicmVuaXNoMDMiLCJhIjoiY2sxanIzZTJqMGRuYTNkcDczMTVhcGxkciJ9.GXUzr1HkEN9HKwi3AGfacQ&limit=1";
    request({url:geocodeURL,json:true},(error,response)=>{
     if(error){
         callback("not able to connect geocode service",undefined)
         
     }else if(response.body.error){
         callback("not able to search",undefined)
        
     }else{
         const data=response.body;
         //console.log(data);
         const longitute=data.features[0].center[0];
         const latitute=data.features[0].center[1];
         callback(undefined,{"Longitute":longitute,"Latitute":latitute,"Place":data.features[0].place_name})
         
     }
     
  }) 
 }
 /*
 geocode('philadelphia',(error,response)=>{
     console.log(error);
     console.log(response);
 })
*/
 module.exports=geocode;