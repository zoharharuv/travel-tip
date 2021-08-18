import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { geoService } from './services/geo.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;

window.onGo = onGo;
window.onSave = onSave;
window.onCopy = onCopy;
window.onMyLocation = onMyLocation;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.onPenToLocation = onPenToLocation;

function onInit() {
    // get queryPos
    const queryPos = {
        lat: getQuery('lat'),
        lng: getQuery('lng')
    }
    // if got lat and lng load it, else load the default
    queryPos.lat && queryPos.lng ? mapService.initMap(queryPos.lat, queryPos.lng) : mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    renderLocs()
    renderWeather()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onMyLocation() {
    mapService.centerMap()
    setTimeout(() => {
        renderWeather()
    }, 500);
}

// on go click get the location from the geo service as promise and then when resolved point the map to that point
function onGo() {
    var location = document.querySelector('[name="location"]').value;

    if (!location) return

    geoService.getLocation(location)
        .then((data) => {
            var loc = data.data.results[0].geometry.location
            mapService.panTo(loc.lat, loc.lng)
            renderWeather()
        })
}

function onSave() {
    var name = document.querySelector('[name="location"]').value.toLowerCase();
    var currLoc = mapService.getCurrentLoc()

    if (!name) return

    var savedLoc = {
        name,
        lat: currLoc.lat,
        lng: currLoc.lng

    }

    locService.saveLoc(savedLoc)
    renderLocs()


}

function renderLocs() {
    const locs = locService.getLocs()
    var elLocsConteiner = document.querySelector('.locations-container')
    var locsHtmls = locs.map(

        function (loc) {
            return `<div class="location-container">
            <button data-name="${loc.name}" onclick="onDeleteLoc(this.dataset.name)">🗑️</button>
            <small>
               Name: ${loc.name} Lat: ${loc.lat} Long: ${loc.lng} 
            </small>
            <button data-lat="${loc.lat}" data-lng="${loc.lng}" onclick="onPenToLocation(+this.dataset.lat,+this.dataset.lng)">🔍</button>
            </div>`
        }

    ).join('')

    elLocsConteiner.innerHTML = locsHtmls

}

function onDeleteLoc(name) {
    locService.deleteLoc(name)
    renderLocs()
}

function onPenToLocation(lat, lng) {
    mapService.panTo(lat, lng);
    renderWeather()
}

function onCopy() {
    // get the current location and send it to updateClipboard
    const { lat, lng } = mapService.getCurrentLoc();
    const hrefURL = `https://zoharharuv.github.io/travel-tip/?lat=${lat}&lng=${lng}`
    navigator.permissions.query({ name: "clipboard-write" })
        .then(res => {
            if (res.state == "granted" || res.state == "prompt") {
                updateClipboard(hrefURL);
            }
        });
}

function updateClipboard(newClip) {
    // update user clipboard with new url
    navigator.clipboard.writeText(newClip)
        .then(() => {
            console.log('Success:');
        }, err => {
            console.log('Error:', err);
        });
}

function getQuery(val) {
    // check the lat and lng in href query
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === val) { return +pair[1]; }
    }
    return (false);
}

function renderWeather() {
    const { lat, lng } = mapService.getCurrentLoc();
    weatherService.getWeather(lat, lng)
        .then(res => {
            const weatherTemp = res.main.temp;
            const weatherDesc = res.weather[0].description;
            const icon = res.weather[0].icon + "@2x.png";
            const iconUrl = `http://openweathermap.org/img/wn/${icon}`;
            let elWeather = document.querySelector('.weather-container');
            elWeather.innerHTML = `
            <img src="${iconUrl}" alt="weather-icon"/>
            <h3>Its currently ${weatherDesc} here</h3>
            <h4>${weatherTemp}\xB0C.</h4>
            `;
        })
}