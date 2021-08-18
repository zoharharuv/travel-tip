export const mapService = {
    initMap,
    addMarker,
    panTo,
    centerMap,
    getCurrentLoc
}

var gCurrentLoc = {}
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    gCurrentLoc = {lat,lng}
  
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);

    gCurrentLoc = {
        lat,
        lng
    }

}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCj3cvoblOrjRpfT79yDM_NXhGy9hKTUzs'
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

//these functions get the user position from the navigator and centers the map on it

function centerMap() {
    getLocation()
  }

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    gMap.setCenter(new google.maps.LatLng(lat, lng));

    gCurrentLoc = {
        lat,
        lng
    }
  }

  function getCurrentLoc(){
      return gCurrentLoc;
  }