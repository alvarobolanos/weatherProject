//Require
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { url } = require('inspector');
const { runInNewContext } = require('vm');

//App
const app = express();

//Use
app.use(bodyParser.urlencoded({extended:true}));

//Routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.post('/', function(req, res){

    const apiKey = '32f9d1b5174bf4e2b4349e9867490a5e';
    const units = "imperial";
    const query = req.body.cityName;

    const url = 'https://api.openweathermap.org/data/2.5/weather?appid=' + apiKey + '&units=' + units +  '&q=' + query;
    
    https.get(url, function(response){
        
        console.log('statusCode:', response.statusCode);
    
        response.on('data', function(data) {
            const weatherData = JSON.parse(data);
            const cityName = weatherData.name;
            const countryName = weatherData.sys.country;
            const temp = weatherData.main.temp;
            const description =  weatherData.weather[0].description;
            const icon =  weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            res.write("<div>")
            res.write("<h1>The current weather in " + cityName + ", " + countryName + " is: " + description + ".</h1>");
            res.write("<img src='" + imageUrl + "' alt='weatherIcon'>");
            res.write("<h2>The temperature in " + cityName + ", " + countryName + " is: </h2>");
            res.write("<ul><li>" + temp.toFixed(2) + " Farhrenheit</li><li>" + (((temp - 32)*5)/9).toFixed(2) + " Celsius.</li></ul>");
            res.write("<form method='POST' action='/'><label for='cityInput'>City Name:<input type='text' name='cityName' id='cityInput'></label><button type='submit'>Get Weather</button></form>");
            res.write("</div>");
            res.send();
        })
    }).on('error', function(error){
        console.log(error);
    });
});


const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Server running at http://localhost:" + port);
});
