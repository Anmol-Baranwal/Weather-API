//jshint esversion:6

const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
// const { url } = require("inspector");
// const { request } = require("http");
const request = require("request");
const { query } = require("express");

const app=express();

app.use(bodyParser.urlencoded({extended:true})); // when the data is rendered from html file then the body parser requires this piece of code

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html"); 
});

app.post("/",function(req,res){
        request("https://api.openweathermap.org/data/2.5/weather?id=2172797&appid=41d4e838890f4df1ae8ff3aec44b8029", function(error, response, body){
            
            // to receive the api response in the JSON Format
            var dataAPI=JSON.parse(response.body);
            console.log(dataAPI);

        });
        const queryInput= req.body.cityName;
        const apiKey= "41d4e838890f4df1ae8ff3aec44b8029";
        const url= "https://api.openweathermap.org/data/2.5/weather?q="+ queryInput +"&appid="+ apiKey;
        const units= "metric";
        https.get(url, function(response){
            console.log(response.statusCode); // to get the status code in the terminal
            // while using the api call response data
            response.on("data", function(data){
                const weatherData= JSON.parse(data);
                const temp= weatherData.main.temp;
                const weatherDescription= weatherData.weather[0].description;
                const icon= weatherData.weather[0].icon;
                const imageUrl="http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.write("<p>The weather is currently "+ weatherDescription +"</p>");
                res.write("<h1>The temperature in "+ queryInput +" is "+ temp +" degree celsius</h1>");
                res.write("<img src="+ imageUrl +" >");
            });

        });
});

app.listen(5000,function(req,res){
    console.log("server is running at port 5000");
});

