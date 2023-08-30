

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

function getHotels() {
    var hotelSearch = 'https://hotels4.p.rapidapi.com/locations/v3/search?q=new%20york&locale=en_US&langid=1033&siteid=300000001';
    fetch(hotelSearch, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8aa5434ef1mshb3c71b6f7580706p15e80fjsn32f11792263e',
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
        }
    })
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data)
            })
        }
    });
}



