const _ = require('lodash');
const elementUtils = require('./element-utils');

/**
 * Tells if the given element is anyhow related to specified rail,
 * regardless of it's track number, position etc.
 */
function isRailElement(railId, element) {
    return _.map(element.raiteet, 'tunniste').includes(railId);
}

/**
 * Ensures the given element is somewhere between rail begin and
 * end positions, thus "on rail".
 */
function isOnRail(element, ratanumero, raideAlku, raideLoppu) {
    const sijainti = elementUtils.getPosition(ratanumero, element);
    return isBetween(raideAlku, raideLoppu, sijainti);
}

/**
 * Tells if the given speed change is between rail begin and end points.
 */
function isSpeedChangeOnRail(raideRataNr, raideAlku, raideLoppu, nopeudet) {
    const { ratanumero, alku } = nopeudet.ratakmvali;
    return ratanumero === raideRataNr && isBetween(raideAlku, raideLoppu, alku);
}

/**
 * Tells if the given given track kilometer overlaps with specified track range.
 */
function isOverlapping(ratanumero, alku, loppu, km) {    
    return km.ratanumero === ratanumero &&
        km.ratakm >= alku.ratakm && km.ratakm <= loppu.ratakm;
}


/**
 * Tells if the beginning of given kilometer is within specified track range.
 */
function isMilepostOnRail(ratanumero, alku, loppu, km) {
    return isOverlapping(ratanumero, alku, loppu, km) && km.ratakm > alku.ratakm;
}

/**
 * Tells if the given element is located exactly at the specified
 * rail begin or end point.
 * 
 * @Deprecated
 */
function isAtRailEnds(element, ratanumero, raideAlku, raideLoppu) {
    const sijainti = elementUtils.getPosition(ratanumero, element);
    return isBeginOrEnd(raideAlku, raideLoppu, sijainti);
}

/**
 * Tells if given position (km+distance) is within given begin/end positions.
 */
function isBetween(alku, loppu, sijainti) {
    return !_.isEmpty(alku) && !_.isEmpty(loppu) && !_.isEmpty(sijainti) &&
        ((sijainti.ratakm > alku.ratakm && sijainti.ratakm < loppu.ratakm) ||
        (sijainti.ratakm === alku.ratakm && sijainti.etaisyys >= alku.etaisyys) ||
        (sijainti.ratakm === loppu.ratakm && sijainti.etaisyys <= loppu.etaisyys));
}

/**
 * Tells if given begin or end match the specified position
 * 
 * @Deprecated * .
 */
function isBeginOrEnd(alku, loppu, sijainti) {
    return !_.isEmpty(alku) && !_.isEmpty(loppu) && !_.isEmpty(sijainti) &&
        ((sijainti.ratakm === alku.ratakm && sijainti.etaisyys === alku.etaisyys) ||
        (sijainti.ratakm === loppu.ratakm && sijainti.etaisyys === loppu.etaisyys));
}

/**
 * Tells if the given switch is referred by the track begin or end.
 */
function isReferredSwitch(vaihde, beginRef, endRef) {
    const switchRef = `swc_${vaihde.tunniste}`;
    return beginRef === switchRef || endRef === switchRef;
}

/**
 * Calculates the precise position on rail, based on actual length of
 * given track kilometers, which may not always be exactly 1000 meters due
 * to historical reasons (e.g. changes in track route and infra).
 */
function getExactPos(raideAlku, sijainti, kilometrit) {

    // rail begin and position within the same kilometer
    if (raideAlku.ratakm === sijainti.ratakm) {
        return sijainti.etaisyys - raideAlku.etaisyys;
    }

    // sum the length of leading kilometers and add/subtract distances
    const kms = _.filter(kilometrit, (km) => km.ratakm < sijainti.ratakm);
    const length = _.sumBy(kms, 'pituus');
    
    return length - raideAlku.etaisyys + sijainti.etaisyys;
}

module.exports = {
   isRailElement, isOnRail, isSpeedChangeOnRail, isMilepostOnRail, isReferredSwitch, getPos: getExactPos, isOverlapping
};
