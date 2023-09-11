//search form variables
var searchBar = document.querySelector('#search-input');
var submitBtn = document.querySelector('#submit-button');

//weather container variable
var weatherCon = document.querySelector('#weather-container');

//results container variable
const resultsContainer = document.getElementById('results-container');

//event container variable
var eventCon = document.querySelector('#event-container');

//list for all event items
var eventsList = document.createElement('ul');

//list for today's events
var currentEvents = document.querySelector('#current-events');
var comingSoonText = document.querySelector('#coming-soon-text'); 

//list for future events
var futureEvents = document.querySelector('#future-events');

//single event modal variables
var modalDiv = document.querySelector('#modal-div');
var singleDiv = document.querySelector('#single-div');
var singleEvent = document.createElement('ul');
var forecastEl = document.createElement('p');
var eventName = document.createElement('h2');
var eventImg = document.createElement('img');
var eventDesc = document.createElement('p');
var eventPrice = document.createElement('p');
var eventLink = document.createElement('a');

//add ui kit classes to event lists
currentEvents.setAttribute('class', 'uk-list uk-list-divider');
futureEvents.setAttribute('class', 'uk-list uk-list-divider');

//add classes to single event items for styling
singleEvent.setAttribute('class', 'single-event');
forecastEl.setAttribute('class', 'card-forecast-text')
eventName.setAttribute('class', 'card-name-text');
eventPrice.setAttribute('class', 'card-price-text');
eventDesc.setAttribute('class', 'event-desc-text');
eventLink.setAttribute('class', 'card-link-text');

//get today's date with dayjs
var today = dayjs().format('YYYY-MM-DD');

submitBtn.addEventListener('click', function getInput(e) {
    //prevent refresh
    e.preventDefault();
    //reset event lists
    currentEvents.innerHTML = '';
    futureEvents.innerHTML = '';
    //set classification choice
    var classChecked = document.querySelector( 'input[name="radioBtn"]:checked').getAttribute('id');
    if (classChecked == 'music-choice') {
        var classChoice = 'music';
    } else if (classChecked == 'sport-choice') {
        var classChoice = 'sports';
    };
    //get search input
    var search = searchBar.value.toLowerCase();
    //use substring to divide city and state input
    var state = search.substr(search.length-3, 3);
    var city = search.substr(0, search.length-4);
    //save search as key value pair
    var prevSearch = {
        'city': city,
        'state': state
    };
    //save to local storage
    searchHistory = localStorage.setItem('saveSearch', JSON.stringify(prevSearch));
    //run api searches with user input
    getEvents(city, state, classChoice);
    getWeather(search);
})

function getEvents(city, state, classChoice) {
    var ticketMaster = 'https://app.ticketmaster.com/discovery/v2/events.json?city=' + city + '&stateCode=' + state + '&classificationName=' + classChoice + '&sort=date,asc&apikey=hMHxReixSyCV55s9yGYRjwi8uBBo39wM';
    fetch(ticketMaster)
    .then(function(response) {
        //if city and state variables have been given a value,
        if(city && state) {
            response.json().then(function(data){
                //run display events function with returned data
                displayEvents(data);
                console.log(data);
            })
        //if city and state variables are null,
        } else { 
            resultsContainer.style.display = 'none';
            weatherCon.style.display = 'none';
            UIkit.modal.alert('Please enter a city and state!');
        }
    });
}

//set empty array for weather api data
var weatherArray = [];

function getWeather(search) {
    var weatherAPIKey = '1306dd10117d4dc1aff35143230109';
    fetch ('https://api.weatherapi.com/v1/forecast.json?key='+weatherAPIKey+'&q='+search+'&days=0')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //variables for weather data
            var sunset = data.forecast.forecastday[0].astro.sunset;
            var eveningTemp = data.forecast.forecastday[0].hour[21].temp_f;
            var eveningCondition = data.forecast.forecastday[0].hour[21].condition.text;
            var eveningRainChance = data.forecast.forecastday[0].hour[21].chance_of_rain;
            weatherCon.innerHTML = '<ul><h3>This evening:</h3><li>'+eveningCondition+'</li><li>Sunset: '+sunset+'</li><li>Temperature: '+eveningTemp+'°</li><li>Chance of Rain: '+eveningRainChance+'%</li></ul>';
            //save weather data into array
            weatherArray = data;
        });
}

function displayEvents(data) {
    resultsContainer.style.display = 'block';
    weatherCon.style.display = 'block';
    //if the ticketmaster api returns an events array,
    if(data.page.totalElements > 0) {
        //for the length of the events array,
        for(i = 0; i < data._embedded.events.length; i++) {
            //create list item
            var eventEl = document.createElement('li');
            //get date of event
            var date = data._embedded.events[i].dates.start.localDate;
            //get date and 24 hour time of event
            var localTime = data._embedded.events[i].dates.start.localTime;
            //convert time into 12 hour format
            var hour = localTime.substr(0, 2);
            var minutes = localTime.substr(3, 2);
            var AmOrPm = hour >= 12 ? 'pm' : 'am'; //via medium.com, how to convert 24 hours format to 12 hours
            twelveHour = (hour % 12) || 12; //via medium.com
            var finalTime = twelveHour + ':' + minutes + AmOrPm;
            //get event id
            var id = data._embedded.events[i].id;
            //get event image
            var image = data._embedded.events[i].images[2].url;
            //get ticketmaster event link
            var link = data._embedded.events[i].url;
            //save 24 hour time of event
            var time = date + ' ' + hour + ':' + minutes;
            //if api returns info for event,
            if (data._embedded.events[i].info) {
                //save info
                var eventInfo = data._embedded.events[i].info;
            } else {
                //else, save empty string
                var eventInfo = "";
            };
            //if api returns a price range for event,
            if (data._embedded.events[i].priceRanges) {
                //save low price
                var priceLow = data._embedded.events[i].priceRanges[0].min;
                //save high price
                var priceHigh = data._embedded.events[i].priceRanges[0].max;
                //if low price and high price are the same,
                if (priceLow === priceHigh) {
                    //set event price as low price
                    var eventPrice = "$"+priceLow;
                } else {
                    //else, set event price as price range
                    var eventPrice = "$"+priceLow+"-"+priceHigh;
                }
            } else {
                //if no price range is returned, set as empty string
                var eventPrice = "";
            };
            
            //set event list item element text
            eventEl.textContent = data._embedded.events[i].name + ' | ' + date + ' ' + finalTime;
            //set data attributes with data from api
            eventEl.setAttribute('data-id', id);
            eventEl.setAttribute('data-date', date);
            eventEl.setAttribute('data-time', finalTime);
            eventEl.setAttribute('data-img', image);
            eventEl.setAttribute('data-desc', eventInfo);
            eventEl.setAttribute('data-price', eventPrice);
            eventEl.setAttribute('data-link', link);
            eventEl.setAttribute('data-time', time);
            //set event list item element attribute to trigger the single event modal to open on click
            eventEl.setAttribute('uk-toggle', "target: #modal-div");
            resultsContainer.style.height="400px";
            resultsContainer.style.width="850px";
            //append to events list
            eventsList.appendChild(eventEl);
            //if event date is today's date,
            if (date === today){
                //save to current events list
                currentEvents.appendChild(eventEl);
            } else {
                //else, save to future events list
                futureEvents.appendChild(eventEl);
                //if there are no events with today's date,
                if (currentEvents.childElementCount == 0) {
                    //create h2 with message
                    var notToday = document.createElement('h2');
                    notToday.textContent = "Sorry, no events today - click below to see what's coming soon!";
                    currentEvents.appendChild(notToday);
                }
            }
        } 
    } else { 
        //if there are no events returned from api,
        currentEvents.textContent = 'Sorry, no events found';
    }
}

//add event listener to event list items
eventCon.addEventListener('click', function furtherDetails(e) {
    if(e.target.nodeName = 'li') {
        //save clicked list item as a variable
        var expanded = e.target;
        //get date and time of event saved as data attributes of the list item
        var date = expanded.getAttribute('data-date');
        var time = expanded.getAttribute('data-time');
        //set forecast paragraph element text as empty string
        forecastEl.textContent = '';
        //if event date is today's date
        if(date === today) {
            //loop through weather api data array
            for(i = 0; i < weatherArray.forecast.forecastday[0].hour.length; i++) {
                //check time of forecast
                forecastHour = weatherArray.forecast.forecastday[0].hour[i].time;
                //if forecast time matches event time,
                if (time === forecastHour) {
                    //get weather data for that hour
                    var condition = weatherArray.forecast.forecastday[0].hour[i].condition.text;
                    var temp = weatherArray.forecast.forecastday[0].hour[i].temp_f;
                    //set forecast paragraph with weather data
                    forecastEl.textContent = 'Forecast: ' + temp + '°F ' + condition;
                    //append to single event modal content
                    singleEvent.appendChild(forecastEl);
                }
            } 
        }
        //get other event info saved as data attributes of the event list item
        eventName.textContent = expanded.innerHTML;
        eventImg.src = expanded.getAttribute('data-img');
        eventLink.href = expanded.getAttribute('data-link');
        eventLink.textContent = 'View on Ticketmaster';
        eventPrice.textContent= expanded.getAttribute('data-price');
        if (expanded.getAttribute('data-desc')){
            eventDesc.textContent = expanded.getAttribute('data-desc');     
        } else {
            eventDesc.textContent = "";
        };
        //append single event modal content
        singleDiv.appendChild(singleEvent);
        singleEvent.appendChild(eventName);
        singleEvent.appendChild(eventImg);
        singleEvent.appendChild(eventDesc);
        singleEvent.appendChild(eventPrice);
        singleEvent.appendChild(eventLink);
    }
})

