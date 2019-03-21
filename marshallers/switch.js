const _ = require('lodash');
const cheerio = require('cheerio');
const config = require('../config');

const SwitchType = {
    ORDINARY: 'ordinary',
    INSIDE_CURVED_SWITCH: 'insideCurvedSwitch',
    OUTSIDE_CURVED_SWITCH: 'outsideCurvedSwitch',
    THREE_WAY_SWITCH: 'threeWaySwitch'
};

const SWITCH_TYPES = {
    "yvo" : SwitchType.ORDINARY,
    "yvv" : SwitchType.ORDINARY,
    "rr" : '',
    "yrv" : '',
    "krv" : '',
    "tyv" : SwitchType.ORDINARY,
    "kvo" : SwitchType.THREE_WAY_SWITCH,
    "kvv" : SwitchType.THREE_WAY_SWITCH,
    "srr" : '',
    "ukvv" : SwitchType.OUTSIDE_CURVED_SWITCH,
    "ukvo" : SwitchType.OUTSIDE_CURVED_SWITCH,
    "skvv" : SwitchType.INSIDE_CURVED_SWITCH,
    "skvo" : SwitchType.INSIDE_CURVED_SWITCH,    
};

module.exports = {
    marshall: (trackId, absPos, vaihde) => {
        
        const type = SWITCH_TYPES[vaihde.vaihde.tyyppi];
        const sijainti = _.find(vaihde.ratakmsijainnit, { ratanumero: trackId });

        const $ = cheerio.load('<switch/>', config.cheerio);
        $('switch').attr('id', vaihde.tunniste);
        $('switch').attr('name', vaihde.nimi);
        $('switch').attr('type', type);
        $('switch').attr('pos', sijainti.etaisyys);
        $('switch').attr('absPos', absPos + sijainti.etaisyys);

        return $.html();
    }
};
