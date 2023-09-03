var searchBar = document.querySelector('.uk-search-field');
var submitBtn = document.querySelector('#submit-button');
var eventCon = document.querySelector('#event-container');
var eventsList = document.createElement('ul');
var backBtn = document.createElement('button');
backBtn.textContent = 'Back to list';

singleEvent = document.createElement('ul');

var eventName = document.createElement('h4');
var eventImg = document.createElement('img');
eventLink = document.createElement('a');
//to-do: add classification input (concerts, sports, arts-theatre, family)


submitBtn.addEventListener('click', function getInput(e) {
    eventsList.innerHTML = '';
    e.preventDefault;
    var search = searchBar.value.toLowerCase();
    var state = search.substr(search.length-3, 3);
    var city = search.substr(0, search.length-4);
    var prevSearch = {
        'city': city,
        'state': state
    }
    searchHistory = localStorage.setItem('saveSearch', JSON.stringify(prevSearch));
    getEvents(city, state);
    //to do: wrap weather fetch in a function so we can apply search variable
})


function getEvents(city, state) {
    var ticketMaster = 'https://app.ticketmaster.com/discovery/v2/events.json?city=' + city + '&stateCode=' + state + '&classificationName=music&apikey=hMHxReixSyCV55s9yGYRjwi8uBBo39wM';
    fetch(ticketMaster)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
                displayEvents(data);
            })
        }
    });
}

function displayEvents(data) {
    for(i = 0; i < data._embedded.events.length; i++) {
        eventEl = document.createElement('li');
        var date = data._embedded.events[i].dates.start.localDate;
        var localTime = data._embedded.events[i].dates.start.localTime;
        var hour = localTime.substr(0, 2);
        var minutes = localTime.substr(3, 2);
        var AmOrPm = hour >= 12 ? 'pm' : 'am'; //via medium.com, how to convert 24 hours format to 12 hours
        hour = (hour % 12) || 12; //via medium.com
        var finalTime = hour + ':' + minutes + AmOrPm;
        var id = data._embedded.events[i].id;
        var image = data._embedded.events[i].images[2].url;
        var link = data._embedded.events[i].url;
        
        eventEl.textContent = data._embedded.events[i].name + ' | ' + date + ' ' + finalTime;
        eventEl.setAttribute('data-id', id);
        eventEl.setAttribute('data-date', date);
        eventEl.setAttribute('data-time', finalTime);
        eventEl.setAttribute('data-img', image);
        eventEl.setAttribute('data-link', link);
        eventCon.appendChild(eventsList);
        eventsList.appendChild(eventEl);
    }
}

eventsList.addEventListener('click', function furtherDetails(e) {
    if(e.target.nodeName = 'li') {
        eventsList.innerHTML = '';

        var expanded = e.target;
        eventName.textContent = expanded.innerHTML;
        eventImg.src = expanded.getAttribute('data-img');
        eventLink.href = expanded.getAttribute('data-link');
        eventLink.textContent = 'View on Ticketmaster';
        eventCon.appendChild(singleEvent);
        singleEvent.appendChild(backBtn);
        singleEvent.appendChild(eventName);
        singleEvent.appendChild(eventImg);
        singleEvent.appendChild(eventLink);
    }
})

backBtn.addEventListener('click', function backToList () {
    eventCon.removeChild(singleEvent);
    var searchHisList = JSON.parse(localStorage.getItem('saveSearch'));
    var city = searchHisList.city;
    var state = searchHisList.state;
    getEvents(city, state);
})

var weatherAPIKey = '1306dd10117d4dc1aff35143230109';
var searchVal = 'Portland, OR';
fetch ('https://api.weatherapi.com/v1/forecast.json?key='+weatherAPIKey+'&q='+searchVal+'&days=0')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var sunset = data.forecast.forecastday[0].astro.sunset;
        var eveningTemp = data.forecast.forecastday[0].hour[21].temp_f;
        var eveningCondition = data.forecast.forecastday[0].hour[21].condition.text;
        var eveningRainChance = data.forecast.forecastday[0].hour[21].chance_of_rain;
    });