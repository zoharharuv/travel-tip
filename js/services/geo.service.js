export const geoService = {
  getLocation
}


function getLocation(location) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}
  &key=AIzaSyCj3cvoblOrjRpfT79yDM_NXhGy9hKTUzs`)
}

