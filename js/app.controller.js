import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { geoService } from './services/geo.service.js'


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGo = onGo;
window.onSave = onSave
window.onMyLocation = onMyLocation
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.onPenToLocation = onPenToLocation;

function onInit() {
    debugger
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
        renderLocs()
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
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onMyLocation() {
    mapService.centerMap()
}

// on go click get the location from the geo service as promise and then when resolved point the map to that point
function onGo() {
    var location = document.querySelector('[name="location"]').value;

    if (!location) return

    geoService.getLocation(location)
        .then((data) => {
            var loc = data.data.results[0].geometry.location
            mapService.panTo(loc.lat, loc.lng)
        })
}

function onSave() {
    var name = document.querySelector('[name="loc-name"]').value.toLowerCase();
    var currLoc = mapService.getCurrrentLoc()

    if (!name) return

    var savedLoc = {
        name,
        lat: currLoc.lat,
        lng: currLoc.lng

    }

    locService.saveLoc(savedLoc)


}

function renderLocs(){

    var elLocsConteiner = document.querySelector('.locations-conteiner')
    var locsHtmls = locService.getLocs().map(

        function(loc){
            return  `<div  class="location-conteiner">
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

function onDeleteLoc(name){
    console.log(name)
}

function onPenToLocation(lat,lng){
console.log(lat,lng)
}

