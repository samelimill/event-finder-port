var searchBar = document.querySelector('#search-input');
var submitBtn = document.querySelector('#submit-button');
var eventCon = document.querySelector('#event-container');
var weatherCon = document.querySelector('#weather-container');
var comingSoonText = document.querySelector('#coming-soon-text'); 
var currentEvents = document.querySelector('#current-events');
var futureEvents = document.querySelector('#future-events');
const resultsContainer = document.getElementById('results-container');

var eventsList = document.createElement('ul');
var forecastEl = document.createElement('p');
var eventName = document.createElement('h2');
var eventImg = document.createElement('img');
var eventDesc = document.createElement('p');
var eventPrice = document.createElement('p');
var eventLink = document.createElement('a');
var modalDiv = document.querySelector('#modal-div');
var singleDiv = document.querySelector('#single-div');
var singleEvent = document.createElement('ul');


currentEvents.setAttribute('class', 'uk-list uk-list-divider');
futureEvents.setAttribute('class', 'uk-list uk-list-divider');
eventName.setAttribute('class', 'card-name-text');
eventPrice.setAttribute('class', 'card-price-text');
eventDesc.setAttribute('class', 'event-desc-text');
eventLink.setAttribute('class', 'card-link-text');
forecastEl.setAttribute('class', 'card-forecast-text')
singleEvent.setAttribute('class', 'single-event');

var today = dayjs().format('YYYY-MM-DD');

submitBtn.addEventListener('click', function getInput(e) {
    e.preventDefault();
    eventsList.innerHTML = '';
    currentEvents.innerHTML = '';
    futureEvents.innerHTML = '';
    var classChecked = document.querySelector( 'input[name="radioBtn"]:checked').getAttribute('id');
    if (classChecked == 'music-choice') {
        var classChoice = 'music';
    } else if (classChecked == 'sport-choice') {
        var classChoice = 'sports';
    };
    var search = searchBar.value.toLowerCase();
    var state = search.substr(search.length-3, 3);
    var city = search.substr(0, search.length-4);
    var prevSearch = {
        'city': city,
        'state': state
    };
    searchHistory = localStorage.setItem('saveSearch', JSON.stringify(prevSearch));
    getEvents(city, state, classChoice);
    getWeather(search);
})

function getEvents(city, state, classChoice) {
    var ticketMaster = 'https://app.ticketmaster.com/discovery/v2/events.json?city=' + city + '&stateCode=' + state + '&classificationName='+classChoice+'&sort=date,asc&apikey=hMHxReixSyCV55s9yGYRjwi8uBBo39wM';
    fetch(ticketMaster)
    .then(function(response) {
        if(city && state) {
            response.json().then(function(data){
                displayEvents(data);
                console.log(data);
            })
        } else { 
            resultsContainer.style.display = 'none';
            weatherCon.style.display = 'none';
            UIkit.modal.alert('Please enter a city and state!');
        }
    });
}

var weatherArray = [];

function getWeather(search) {
    var weatherAPIKey = '1306dd10117d4dc1aff35143230109';
    fetch ('https://api.weatherapi.com/v1/forecast.json?key='+weatherAPIKey+'&q='+search+'&days=0')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var sunset = data.forecast.forecastday[0].astro.sunset;
            var eveningTemp = data.forecast.forecastday[0].hour[21].temp_f;
            var eveningCondition = data.forecast.forecastday[0].hour[21].condition.text;
            var eveningRainChance = data.forecast.forecastday[0].hour[21].chance_of_rain;
            weatherCon.innerHTML = '<ul><h3>This evening:</h3><li>'+eveningCondition+'</li><li>Sunset: '+sunset+'</li><li>Temperature: '+eveningTemp+'°</li><li>Chance of Rain: '+eveningRainChance+'%</li></ul>';
            weatherArray = data;
        });
}

function displayEvents(data) {
    console.log(data);
    resultsContainer.style.display = 'block';
    weatherCon.style.display = 'block';
    if(data.page.totalElements > 0) {
        for(i = 0; i < data._embedded.events.length; i++) {
            var eventEl = document.createElement('li');
            var date = data._embedded.events[i].dates.start.localDate;
            var localTime = data._embedded.events[i].dates.start.localTime;
            var hour = localTime.substr(0, 2);
            var minutes = localTime.substr(3, 2);
            var AmOrPm = hour >= 12 ? 'pm' : 'am'; //via medium.com, how to convert 24 hours format to 12 hours
            twelveHour = (hour % 12) || 12; //via medium.com
            var finalTime = twelveHour + ':' + minutes + AmOrPm;
            var id = data._embedded.events[i].id;
            var image = data._embedded.events[i].images[2].url;
            var link = data._embedded.events[i].url;
            var time = date + ' ' + hour + ':' + minutes;
            if (data._embedded.events[i].info) {
                var eventInfo = data._embedded.events[i].info;
            } else {
                var eventInfo = "";
            };
            if (data._embedded.events[i].priceRanges) {
                var priceLow = data._embedded.events[i].priceRanges[0].min;
                var priceHigh = data._embedded.events[i].priceRanges[0].max;
                if (priceLow === priceHigh) {
                    var eventPrice = "$"+priceLow;
                } else {
                    var eventPrice = "$"+priceLow+"-"+priceHigh;
                }
            } else {
                var eventPrice = "";
            };

            eventEl.textContent = data._embedded.events[i].name + ' | ' + date + ' ' + finalTime;
            eventEl.setAttribute('data-id', id);
            eventEl.setAttribute('data-date', date);
            eventEl.setAttribute('data-time', finalTime);
            eventEl.setAttribute('data-img', image);
            eventEl.setAttribute('data-desc', eventInfo);
            eventEl.setAttribute('data-price', eventPrice);
            eventEl.setAttribute('data-link', link);
            eventEl.setAttribute('data-time', time);
            eventEl.setAttribute('uk-toggle', "target: #modal-div");
            resultsContainer.style.height="400px";
            resultsContainer.style.width="850px";
            eventsList.appendChild(eventEl);
            if (date == today){
                currentEvents.appendChild(eventEl);
            } else if (date > today){
                futureEvents.appendChild(eventEl);
                if (currentEvents.childElementCount == 0) {
                    var notToday = document.createElement('h2');
                    notToday.textContent = "Sorry, no events today - click below to see what's coming soon!";
                    currentEvents.appendChild(notToday);
                }
            }
        } 
    } else { 
        currentEvents.textContent = 'Sorry, no events found';
    }
}

eventCon.addEventListener('click', function furtherDetails(e) {
    if(e.target.nodeName = 'li') {
        var expanded = e.target;
        var date = expanded.getAttribute('data-date');
        var time = expanded.getAttribute('data-time');
        if(date === today) {
            for(i = 0; i < weatherArray.forecast.forecastday[0].hour.length; i++) {
                forecastHour = weatherArray.forecast.forecastday[0].hour[i].time;
                console.log(forecastHour);
                if (time === forecastHour) {
                    var condition = weatherArray.forecast.forecastday[0].hour[i].condition.text;
                    var temp = weatherArray.forecast.forecastday[0].hour[i].temp_f;
                    forecastEl.textContent = 'Forecast: ' + temp + '°F ' + condition;
                    singleEvent.appendChild(forecastEl);
                    console.log(date, today);
                }
                if (i === weatherArray.forecast.forecastday[0].hour.length) {
                    forecastEl.textContent = '';
                }
            } 
        } else { forecastEl.textContent = ''; }
        
        eventName.textContent = expanded.innerHTML;
        eventImg.src = expanded.getAttribute('data-img');
        eventLink.href = expanded.getAttribute('data-link');
        eventLink.textContent = 'View on Ticketmaster';
        eventPrice.textContent= expanded.getAttribute('data-price');
        singleDiv.appendChild(singleEvent);
        singleEvent.appendChild(forecastEl);
        singleEvent.appendChild(eventName);
        singleEvent.appendChild(eventImg);
        if (expanded.getAttribute('data-desc')){
            eventDesc.textContent = expanded.getAttribute('data-desc');     
        } else {
            eventDesc.textContent = "";
        };
        singleEvent.appendChild(eventDesc);
        singleEvent.appendChild(eventPrice);
        singleEvent.appendChild(eventLink);
    }
})

