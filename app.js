//jshint esversion:6

const express= require("express");
const https= require("https");
const bodyParser= require("body-parser");
const request= require("request");
const { query, response }= require("express");
require('dotenv').config(); //for security of API key
const path = require('path');
const router = express.Router();
const countries= require("i18n-iso-countries"); // for converting country code to full name
const fetch= require("node-fetch");
// const { url } = require("inspector");
// const { request } = require("http");
countries.registerLocale(require("i18n-iso-countries/langs/en.json")); // minimizing the file size by specifying the language

const app=express();

app.set("view engine", "ejs"); // this tells the app generated by express to use ejs as its view engine - refer to the docs

// for encoding the data
app.use(bodyParser.urlencoded({extended:true})); // when the data is rendered from html file then the body parser requires this piece of code
app.use(express.static(__dirname + '/public')); // used for css files

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html"); 
});

const apiKey= process.env.OPEN_WEATHER_API_KEY
const cageAPIKey= process.env.OPEN_CAGE_API_KEY


var nationCode;
var latCopy;
var lonCopy;
let dataFinal;
var val=1, val_1=2;
var latitude= function main() {};

app.get('/weather',function(req,res){
    res.sendFile(__dirname+'/weather.html');
});

app.get('/air-quality',function(req,res){
    res.sendFile(__dirname+'/air-quality.html');
});

app.post("/air-quality", function(req,res){
        request("https://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid="+ apiKey +"", function(error, response, body){

            // to get the json response in the console
            var dataAPI=JSON.parse(response.body);
            // console.log(dataAPI);
        });
        

        var queryInput= req.body.addressUser;
        const urlCoordinate= "https://api.opencagedata.com/geocode/v1/json?q="+ queryInput +"&key="+ cageAPIKey +"";

        https.get(urlCoordinate, function(response){
            let airData='';
            response.on('data', data => airData += data);
            response.on('end', () => {
                const addressData= JSON.parse(airData);
                const lat= addressData.results[0].geometry.lat; // the latitude of the city
                // console.log(lat);
                const lon= addressData.results[0].geometry.lng;
                queryInput= addressData.results[0].components.city;
                const nationCode=addressData.results[0].components['ISO_3166-1_alpha-2'];
                // pm.set.environment("latCopy",JSON.stringify(lat));
                // map.set(latCopy, addressData.results[0].geometry.lat);

                function mockApi() {
                    return new Promise((res, rej) => {
                        // setTimeout(() => res(addressData.results[0].geometry.lat), 1000)
                        // res(data).then(token => { return token });
                        res(addressData.results[0].geometry.lat);
                    })
                }

                // mockApi()
                //     .then(function(result) {
                    //   console.log('the result'+result);
                      
                //     }).catch(function(err){
                //         console.log('The error'+ err);
                //     })

                async function main() {
                    // let data = await mockApi(addressData.results[0].geometry.lat);
                    dataFinal = await mockApi(urlCoordinate);
                    // console.log('data final val is '+dataFinal);
                    // showData1(addressData.results[0].geometry.lng);
                       
                }
                console.log('the state is'+main());
                console.log('data final val is '+dataFinal);
            });

            function showData(data) {
                console.log('inside showdata');
                console.log('data in var is '+dataFinal);
            }
            // console.log('latitude is '+ latCopy);
        });
        // const url= "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+  +"&lon="+  +"&appid="+ apiKey +"";
        // console.log(url);

        // 1. We can get the zip code from the user & retrieve the country code from that location thus making air pollution api call of openweathermap
        // 2. We can get the address from the user thus getting the more accurate coordinates and making the api call of openweathermap
        // Earlier I was making a api call to openweathermap from the zip code entered by user & country code by opencage, then making final api call with the coordinates to openweathermap
        // But I think the opencage api would be sufficient for the thing so I am making the changes, In case you want to see then see commit history


        // const url= "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+ main() +"&lon="+ lon +"&appid="+ apiKey +"";
        const url= "https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=25.3923&lon=82.5533&appid="+ apiKey +"";

        https.get(url, function(response){
            console.log(response.statusCode); // to get the status code in the terminal
            // console.log(url);
            let resultData='';
            response.on('data', data => resultData += data);
            response.on('end', () => {
                // while using the api call response data {https://openweathermap.org/api/air-pollution#descr}
                const airQuality=JSON.parse(resultData);
                // console.log(airQuality);
                const lat= airQuality.coord.lat;
                const lon= airQuality.coord.lon;
                const airQualityIndex= airQuality.list[0].main.aqi;
                const unixTime= airQuality.list[0].dt;
                const co= airQuality.list[0].components.co;
                const no= airQuality.list[0].components.no;
                const no2= airQuality.list[0].components.no2;
                const o3= airQuality.list[0].components.o3;
                const so2= airQuality.list[0].components.so2;
                const pm2_5= airQuality.list[0].components.pm2_5;
                const pm10= airQuality.list[0].components.pm10;
                const nh3= airQuality.list[0].components.nh3;
                
                const query = queryInput.charAt(0).toUpperCase() + queryInput.slice(1);

                const getBrowserLocale = () => navigator.language || navigator.browserLanguage || (navigator.languages || ["en"])[0]
                const date= new Date(unixTime*1000);
                const options={month: 'short', day: 'numeric', year: 'numeric'};
                const dt= date.toLocaleDateString(getBrowserLocale, options);

                // for getting the northern/southern hemisphere
                var verticalHemisphere="";
                if(lat>=0)   verticalHemisphere="°N in Northern";
                else    verticalHemisphere="°S in Southern";

                // for getting the western/eastern hemisphere
                var horizontalHemisphere="";
                if(lon>=0)   horizontalHemisphere="°E in Eastern";
                else    horizontalHemisphere="°W in Western";

                // cloudy description
                var airDesc="";
                if(airQualityIndex==1) airDesc="Good :  No health implications.";
                else if(airQualityIndex==2)   airDesc="Fair :  Some pollutants might arouse modest health concern for hypersensitive people.";  
                else if(airQualityIndex==3)   airDesc="Moderate :  Healthy people may experience slight irritations, and sensitive individuals will be slightly affected to a larger extent.";
                else if(airQualityIndex==4)   airDesc="Poor :  People should moderately reduce outdoor activities, they may develop heart & respiratory problems.";
                else if(airQualityIndex==5)   airDesc="Very Poor : Serious health implications";

                // AQI Category & Health Breakpoints
                // co level category
                var coDesc="";
                if(co>=0 && co<=1)  coDesc="Good!";
                else if(co>=1.1 && co<=2)   coDesc="Satisfactory!";
                else if(co>=2.1 && co<=10)   coDesc="Moderate!";  
                else if(co>10 && co<=17)   coDesc="Poor!";  
                else if(co>17 && co<=34)   coDesc="Severe!";  
                else if(co>34)   coDesc="Harzadous!";  

                // no2 level category
                var no2Desc="";
                if(no2>=0 && no2<=40)  no2Desc="Good!";
                else if(no2>=41 && no2<=80)   no2Desc="Satisfactory!";
                else if(no2>=81 && no2<=180)   no2Desc="Moderate!";  
                else if(no2>=181 && no2<=280)   no2Desc="Poor!";  
                else if(no2>=281 && no2<=400)   no2Desc="Severe!";  
                else if(no2>400)   no2Desc="Harzadous!";

                // o3 level category
                var o3Desc="";
                if(o3>=0 && o3<=50)  o3Desc="Good!";
                else if(o3>=51 && o3<=100)   o3Desc="Satisfactory!";
                else if(o3>=101 && o3<=168)   o3Desc="Moderate!";  
                else if(o3>=169 && o3<=208)   o3Desc="Poor!";  
                else if(o3>=209 && o3<=748)   o3Desc="Severe!";  
                else if(o3>748)   no2Desc="Harzadous!";

                // so2 level category
                var so2Desc="";
                if(so2>=0 && so2<=40)  so2Desc="Good!";
                else if(o3>=41 && o3<=80)   so2Desc="Satisfactory!";
                else if(o3>=81 && o3<=380)   so2Desc="Moderate!";  
                else if(o3>=381 && o3<=800)   so2Desc="Poor!";  
                else if(o3>=801 && o3<=1600)   so2Desc="Severe!";  
                else if(o3>1600)   no2Desc="Harzadous!";

                // pm2.5 level category
                var pm2Desc="";
                if(pm2_5>=0 && pm2_5<=30)  pm2Desc="Good!";
                else if(pm2_5>=31 && pm2_5<=60)   pm2Desc="Satisfactory!";
                else if(pm2_5>=61 && o3<=90)   pm2Desc="Moderate!";  
                else if(pm2_5>=91 && o3<=120)   pm2Desc="Poor!";  
                else if(pm2_5>=121 && o3<=250)   pm2Desc="Severe!";  
                else if(pm2_5>250)   no2Desc="Harzadous!";

                // pm10 level category
                var pm10Desc="";
                if(pm10>=0 && pm10<=50)  pm10Desc="Good!";
                else if(pm10>=51 && pm10<=100)   pm10Desc="Satisfactory!";
                else if(pm10>=101 && pm10<=250)   pm10Desc="Moderate!";  
                else if(pm10>=251 && pm10<=350)   pm10Desc="Poor!";  
                else if(pm10>=351 && pm10<=430)   pm10Desc="Severe!";  
                else if(pm10>430)   pm10Desc="Harzadous!";
                
                // nh3 level category
                var nh3Desc="";
                if(nh3>=0 && nh3<=200)  nh3Desc="Good!";
                else if(nh3>=201 && nh3<=400)   nh3Desc="Satisfactory!";
                else if(nh3>=401 && nh3<=800)   nh3Desc="Moderate!";  
                else if(nh3>=801 && co<=1200)   nh3Desc="Poor!";  
                else if(nh3>1200 && co<=1800)   nh3Desc="Severe!";  
                else if(nh3>1800)   coDesc="Harzadous!";

                res.render('output-airQuality',{city: query, airQlt: airQualityIndex, date: dt, coLevel: co,
                    noLevel: no, latitute: lat, longitude: lon, no2Level: no2, o3Level: o3, so2Level: so2,
                    fineParticles: pm2_5, coarseParticles: pm10, nh3Level: nh3, vH: verticalHemisphere, 
                    hH: horizontalHemisphere, airDescription: airDesc, coDescription: coDesc, no2Description: no2Desc,
                    o3Description: o3Desc, so2Description: so2Desc, pm2Description: pm2Desc, pm10Description: pm10Desc,
                    nh3Description: nh3Desc});   // sending all info related to different fields to the output-airQuality.ejs

                res.end();

            });
        });
        
});

app.post("/weather",function(req,res){
        request("https://api.openweathermap.org/data/2.5/weather?id=2172797&appid="+ apiKey +"", function(error, response, body){
            
            // to receive the api response in the JSON Format
            var dataAPI=JSON.parse(response.body);
            console.log(dataAPI);

        });
        queryInput= req.body.cityName;
        const units= "metric";
        const url= "https://api.openweathermap.org/data/2.5/weather?q="+ queryInput +"&appid="+ apiKey +"&units="+ units +"";
        https.get(url, function(response){
            console.log(response.statusCode); // to get the status code in the terminal
            // while using the api call response data
            response.on("data", function(data){
                const weatherData= JSON.parse(data);
                const temp= weatherData.main.temp;
                const weatherDescription= weatherData.weather[0].description;
                const icon= weatherData.weather[0].icon;
                const imageUrl= "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // to get the image related to the weather
                const maxTemp= weatherData.main.temp_max; // max current temperature of the city
                lat= weatherData.coord.lat; // the latitude of the city
                lon= weatherData.coord.lon; // the longitude of the city
                const hum= weatherData.main.humidity; // humidity percentage
                var visi= weatherData.visibility; // visibility in the air                 (it may show the same value, but i have checked and it shows different values based on time and place)
                visi= visi/100;  // converting from meters to kilometers 
                const clouds= weatherData.clouds.all;  // the percentage of cloudiness

                const countryCode=weatherData.sys.country;

                // for getting the northern/southern hemisphere
                var verticalHemisphere="";
                if(lat>=0)   verticalHemisphere="°N in Northern";
                else    verticalHemisphere="°S in Southern";

                // for getting the western/eastern hemisphere
                var horizontalHemisphere="";
                if(lon>=0)   horizontalHemisphere="°E in Eastern";
                else    horizontalHemisphere="°W in Western";

                // cloudy description
                var cloudyDesc="";
                if(clouds>=0 && clouds<=10) cloudyDesc="Sunny";
                else if(clouds>=11 && clouds<=19)   cloudyDesc="Fair";
                else if(clouds>=20 && clouds<=29)   cloudyDesc="Mostly sunny";
                else if(clouds>=30 && clouds<=59)   cloudyDesc="Partly cloudy";
                else if(clouds>=60 && clouds<=69)   cloudyDesc="Partly sunny";
                else if(clouds>=70 && clouds<=89)   cloudyDesc="Mostly Cloudy";
                else if(clouds>=90 && clouds<=100)  cloudyDesc="Overcast";

                //comfortability check based on humidity
                var comfort="";
                if(hum<=55) comfort="dry & comfortable";
                else if(hum>=56 && hum<=64) comfort="sticky with muggy evenings";
                else if(hum>=65) comfort="oppresive moisture";

                const query = queryInput.charAt(0).toUpperCase() + queryInput.slice(1); // capitalising the first letter of the entered query
                
                // to convert country abbreviation code to full country name
                var countryFullName= countries.getName(""+ countryCode +"", "en", {select: "official"});

                res.render('output-weather',{city: query, temperature: temp, description: weatherDescription, image: imageUrl,
                                             maxTemperature: maxTemp, latitute: lat, longitude: lon, humidity: hum,
                                             visibility: visi, cloudiness: clouds, cloudDesc: cloudyDesc, countryName: countryFullName, 
                                             vH: verticalHemisphere, hH: horizontalHemisphere, comfortLevel: comfort});   // sending additional info related to different fields

                res.end();
            });

        });
        
});

app.listen(3000 || process.env.PORT ,function(req,res){
    console.log("server is running at port 3000");
});
