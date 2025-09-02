const crypto = require('crypto');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I


function randomFromAlphabet(len) {
    let out = '';
    for (let i = 0; i < len; i++) {
        // randomInt avoids modulo bias
        out += ALPHABET[crypto.randomInt(0, ALPHABET.length)];
    }
    return out;
}

/**
 * @param {number} len
 * @param {string} start
 */
function generateSerial(len = 9,{start}) {
    return `${start}-${randomFromAlphabet(len)}`; // e.g., 7F3X2H8K
}

module.exports = { generateSerial };