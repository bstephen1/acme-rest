const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())
 
const profiles = [
    {id: 1, 
        name: {
            first: 'john', 
            last: 'doe'
        }, 
        interests: ['walking', 'jogging'], 
        latitude: 38.9072,
        longitude: -77.0369,
    },
]
 
//GET
app.get('/profiles/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) res.status(404).send('Id not valid')

    let profile = doQuery(id)
    
    if (!profile) res.status(404).send('Profile not found');

    getLocationData(profile.latitude, profile.longitude).then(function(weatherRes){
        const properties = weatherRes.data.properties
        const locationProperties = properties.relativeLocation.properties
        profile.city = locationProperties.city
        profile.state = locationProperties.state
        return getStations(properties.gridId, properties.gridX, properties.gridY)
    })
    .then(function(weatherRes) {
        const firstStationId = weatherRes.data.features[0].properties.stationIdentifier
        return getLatestTemperature(firstStationId)
    })
    .then(function(weatherRes) {
        profile.temperature = weatherRes.data.properties.temperature.value
        res.send(profile)
    })
})
 
//CREATE
app.post('/profiles', (req, res)=> {
    if (!validateProfile(req.body)){
        res.status(400).send(error.details[0].message)
        return;
    }

    const profile = {
        id: req.body.id,
        name: { 
            first: req.body.name?.first, 
            last: req.body.name?.last
        },
        interests: req.body.interests,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    }

    saveProfile(profile)
    res.send(profile)
})
 
function validateProfile(profile) {
    //can add any validation
    return true
}

 async function getLocationData(latitude, longitude) {
    const endpoint = `https://api.weather.gov/points/${latitude},${longitude}`
    return await axios.get(endpoint)
}

async function getStations(wfo, x, y) {
    const endpoint = `https://api.weather.gov/gridpoints/${wfo}/${x},${y}/stations`
    return await axios.get(endpoint)
}

async function getLatestTemperature(stationId) {
    const endpoint = `https://api.weather.gov/stations/${stationId}/observations/latest`
    return await axios.get(endpoint)
}

//can be expanded to query from db
function doQuery(field) {
    return profiles.find(profile => profile.id === field)
}

//can be expanded to save to a db
function saveProfile(profile) {
    profiles.push(profile)
}
 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`))