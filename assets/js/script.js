var searchBar = document.querySelector('#search-input');
var submitBtn = document.querySelector('#submit-button');
var eventCon = document.querySelector('#event-container');
var weatherCon = document.querySelector('#weather-container');
var comingSoonText = document.querySelector('#coming-soon-text'); 
// var listDiv = document.createElement('div');
// listDiv.setAttribute('class', 'uk-panel-scrollable');

var eventsList = document.createElement('ul');
var currentEvents = document.querySelector('#current-events');
var futureEvents = document.querySelector('#future-events');
currentEvents.setAttribute('class', 'uk-list uk-list-divider');
futureEvents.setAttribute('class', 'uk-list uk-list-divider');

const resultsContainer = document.getElementById('results-container')

// listDiv.appendChild(currentEvents);


var backBtn = document.createElement('button');
backBtn.setAttribute('class', 'uk-modal-close-outside back-bttn');
backBtn.textContent = 'Back to list';
var modalDiv = document.querySelector('#modal-div');
var singleDiv = document.querySelector('#single-div');
var singleEvent = document.createElement('ul');
singleEvent.setAttribute('class', 'single-event');



var today = dayjs().format('YYYY-MM-DD');
var forecastEl = document.createElement('p');
var eventName = document.createElement('h2');
var eventImg = document.createElement('img');
var eventLink = document.createElement('a');
//to-do: add classification input (concerts, sports, arts-theatre, family)


submitBtn.addEventListener('click', function getInput(e) {
    e.preventDefault();
    eventsList.innerHTML = '';
    currentEvents.innerHTML = '';
    futureEvents.innerHTML = '';
    var search = searchBar.value.toLowerCase();
    var state = search.substr(search.length-3, 3);
    var city = search.substr(0, search.length-4);
    var prevSearch = {
        'city': city,
        'state': state
    }
    searchHistory = localStorage.setItem('saveSearch', JSON.stringify(prevSearch));
    getEvents(city, state);
    getWeather(search);
})



function getEvents(city, state) {
    var ticketMaster = 'https://app.ticketmaster.com/discovery/v2/events.json?city=' + city + '&stateCode=' + state + '&classificationName=music&sort=date,asc&apikey=hMHxReixSyCV55s9yGYRjwi8uBBo39wM';
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
            var weatherIcon = weatherArray;

            eventEl.textContent = data._embedded.events[i].name + ' | ' + date + ' ' + finalTime;
            eventEl.setAttribute('data-id', id);
            eventEl.setAttribute('data-date', date);
            eventEl.setAttribute('data-time', finalTime);
            eventEl.setAttribute('data-img', image);
            eventEl.setAttribute('data-link', link);
            eventEl.setAttribute('data-time', time);
            eventEl.setAttribute('uk-toggle', "target: #modal-div");
            // eventCon.appendChild(listDiv);
            // listDiv.style.height="400px"
            // listDiv.style.width="850px"
            resultsContainer.style.height="400px";
            resultsContainer.style.width="850px";
            eventsList.appendChild(eventEl);

            
            
            if (date == today){
                currentEvents.appendChild(eventEl);
            } else if (date > today){
                document.querySelector('#coming-soon-text').textContent = 'Coming Soon . . .'
                futureEvents.appendChild(eventEl);
            }
        } 
    } else { 
        messageEl = document.createElement('p');
        messageEl.textContent = 'Sorry, no events found';
        eventCon.appendChild(eventsList);
        eventsList.appendChild(messageEl);
    }
}

eventCon.addEventListener('click', function furtherDetails(e) {
    if(e.target.nodeName = 'li') {
        var expanded = e.target;
        var condition;
        var temp;
        var date = expanded.getAttribute('data-date');
        console.log(expanded);
        var time = expanded.getAttribute('data-time');
        for(i=0; i < weatherArray.forecast.forecastday[0].hour.length; i++) {
            var forecastHour = weatherArray.forecast.forecastday[0].hour[i].time;
            if (date === today && time === forecastHour) {
                condition = weatherArray.forecast.forecastday[0].hour[i].condition.text;
                temp = weatherArray.forecast.forecastday[0].hour[i].temp_f;
                forecastEl.textContent = 'Forecast: ' + temp + '°F ' + condition;
            }
            else { forecastEl.textContent = ''; }
        }
        eventName.textContent = expanded.innerHTML;
        eventImg.src = expanded.getAttribute('data-img');
        eventLink.href = expanded.getAttribute('data-link');
        eventLink.textContent = 'View on Ticketmaster';
        singleDiv.appendChild(singleEvent);
        singleEvent.appendChild(backBtn);
        singleEvent.appendChild(forecastEl);
        singleEvent.appendChild(eventName);
        singleEvent.appendChild(eventImg);
        singleEvent.appendChild(eventLink);
    }
})

