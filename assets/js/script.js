

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
    var hotelSearch = 'https://test.travel.api.amadeus.com/v2/shopping/hotel-offers/v3v7rFUKkGoqtru6eGO6PUi8PnVEAEH1gI';
    fetch(hotelSearch)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data)
            })
        }
    });
}


