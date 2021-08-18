export const locService = {
    getLocs,
    saveLoc
}

import { storageService } from './services/storage.service'

const locs = storageService.load('locsDB') || [
    { name: 'greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return locs;
}

function saveLoc(userLoc) {
    const isLocExist = locs.some(loc => {
        return loc.name === userLoc.name;
    })
    if(!isLocExist){
        locs.push(userLoc)
        storageService.save('locsDB', locs)
    }
}


