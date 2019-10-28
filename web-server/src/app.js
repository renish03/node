const path=require('path');
const express=require("express");
const app=express();
const hbs=require('hbs');
const request=require("request")
const forecast=require("./utils/forecast");
const geocode=require("./utils/geocode");

const port=process.env.PORT||3000;
const publicDirPath=path.join(__dirname,"../public")
const viewsPath=path.join(__dirname,"../templates/views");
const partialPath=path.join(__dirname,"../templates/partials");
// static folder path
app.use(express.static(publicDirPath));

// handle bar constant
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialPath);

app.get('',(req,res)=>{
    res.render('index',{"name":"Rahul","title":"App"});
})

app.get('/about',(req,res)=>{
    res.render('about',{"title":"About","name":"Raj"})
})

app.get('/help',(req,res)=>{
    res.render('help',{"title":"Help","name":"Raj"})
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        res.send({"error":"kindly provide address text"});    
    }
   
    // geocode
    geocode(req.query.address,(error,{Longitute,Latitute,Place}={})=>{
        if(error){
           return res.send({"error":error});  
        }
          
        forecast(Longitute,Latitute,(error,forecastdata)=>{
            if(error){
                return res.send({"error":error});
            }
            //console.log(Place);
            //console.log(forecastdata);
            res.send({"address":req.query.address,
            "location":Place,
            "forecast":forecastdata 
            })

        })


    })
   
})

/*
app.get('/',(req,res)=>{
    res.send('Welcome to Express');
})

app.get('/help',(req,res)=>{
    res.send({"name":"Rahul","age":"30"});
})
*/
/*
app.get('/about',(req,res)=>{
    res.send('<h1>Welcome to About Page</h1>');
})
*/
app.get('/aboutus',(req,res)=>{
    res.send('<h1>Welcome to aboutus Page</h1>');
})

// 404 pages
app.get('/help/*',(req,res)=>{
    //res.send('404 page!!');
    res.render('404',{"errorMessage":"help article not found","name":"rr"})
})
app.get('*',(req,res)=>{
    //res.send('My 404 Page!!');
    res.render('404',{"errorMessage":"404 page","name":"manoj"})
})
app.listen(port,()=>{
    console.log("Server is up on port "+port);
})