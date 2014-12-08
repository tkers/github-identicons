/**
 * GitHub-Identicons - libs/createIdenticon
 *
 * Copyright(c) 2014 Tijn Kersjes
 * All rights reserved.
 */

// dependencies
var crypto = require("crypto");

function createIdenticon(username, alg) {

    // fall back to md5
    if (alg !== "sha1" && alg !== "sha256" && alg !== "sha512")
        alg = "md5";

    // convert to string when needed
    if (typeof username !== "string")
        username = username.toString();

    // get MD5 hash of username in HEX format
    var hash = crypto.createHash(alg).update(username).digest("hex");

    // HEX to intarray
    var bytes = [];
    for (var i = 0; i < 16; i++) {
        bytes[i] = parseInt(hash.substr(i*2, 2), 16);
    }

    // convert to mask
    var bools = bytes.map(function (b) {
        return (b % 2 !== 0)
    });

    // build 3x5 matrix
    var matrix = [];
    for (var y = 0; y < 5; y++) {
        matrix[y] = [];
        for (var x = 0; x < 3; x++) {
            matrix[y][x] = bools[1 + 3*y + x];
        }
    }

    // mirror horizontally
    var pixels = matrix.map(function (row) {
        return row.concat([row[1], row[0]]);
    });

    // get hue, saturation and value
    var hue = bytes[15];
    var sat = 120;
    var val = 200;

    // convert to rgb
    var rgb = hsv2rgb(hue, sat, val);

    // return the pixel mask and colour
    return {
        mask  : pixels,
        color : {
            r : rgb[0],
            g : rgb[1],
            b : rgb[2],
            h : hue,
            s : sat,
            v : val
        }
    };
}

function hsv2rgb(h, s, v) {

    s /= 255;
    v /= 255;

    var i = Math.floor(h / 42.5);
    var f = h / 42.5 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    var r, g, b;

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    // return as 3 bytes
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

module.exports = createIdenticon;
