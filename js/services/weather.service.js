export const weatherService = {
    getWeather
}

const WEATHER_KEY = 'demo';

function getWeather(lat, lng) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${WEATHER_KEY}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            throw new Error('Got error:', err)
        })
}