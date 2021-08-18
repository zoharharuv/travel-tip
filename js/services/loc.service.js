export const locService = {
    getLocs,
    saveLoc,
    deleteLoc
}

import { storageService } from './storage.service.js'

var locs

_createLocs()

function _createLocs() {

    var localLocs = storageService.load('locsDB')

    if (localLocs && localLocs.length) locs = localLocs

    else

    locs = [

            {
                name: 'name1',
                lat: 0,
                lng: 0
            },
            {
                name: 'name2',
                lat: 0,
                lng: 0
            }



        ]
}



function getLocs() {
    return locs;
}

function saveLoc(userLoc) {
    const isLocExist = locs.some(loc => {
        return loc.name === userLoc.name;
    })
    if (!isLocExist) {
        locs.push(userLoc)
        storageService.save('locsDB', locs)
    }
}

function getIdByName(name) {
    return locs.findIndex(loc => { loc.name === name })
}

function deleteLoc(name) {
    var locIdx = getIdByName(name)
    locs.splice(locIdx, 1)
    storageService.save('locsDB', locs)

}


