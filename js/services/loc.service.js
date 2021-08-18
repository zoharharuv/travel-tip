

export const locService = {
    getLocs,
    saveLoc
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
   return locs
}

function saveLoc(loc){
    locs.push(loc)
    
}


