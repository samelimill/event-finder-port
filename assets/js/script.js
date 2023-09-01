function getEvents() {
    var ticketMaster = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=hMHxReixSyCV55s9yGYRjwi8uBBo39wM';
    fetch(ticketMaster)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data)
            })
        }
    });
}

var weatherAPIKey = '1306dd10117d4dc1aff35143230109';
var searchVal = 'Portland, OR';
fetch ('https://api.weatherapi.com/v1/forecast.json?key='+weatherAPIKey+'&q='+searchVal+'&days=0')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var sunset = data.forecast.forcastDay[0].astro.sunset;
        var eveningTemp = data.forecast.forecastDay[0].hour[21].temp_f;
        var eveningCondition = data.forecast.forecastDay[0].hour[21].condition.text;
        var eveningRainChance = data.forecast.forecastDay[0].hour[21].chance_of_rain;
    });