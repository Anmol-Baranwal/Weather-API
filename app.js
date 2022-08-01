//jshint esversion:6

const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const { url } = require("inspector");
// const request = require("request");

const app=express();

app.use(bodyParser.urlencoded({extended:true})); // when the data is rendered from html file then the body parser requires this piece of code

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html"); 
});

app.post("/",function(req,res){
    

});

app.listen(5000,function(req,res){
    console.log("server is running at port 5000");
});

