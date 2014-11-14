/**
 * GitHub-Identicons
 *
 * Copyright(c) 2014 Tijn Kersjes
 * All rights reserved.
 */

// dependencies
var crypto = require("crypto");

function createIdenticon(username) {

    // convert to string when needed
    if (typeof username !== "string")
        username = username.toString();

    // get MD5 hash of username in HEX format
    var hash = crypto.createHash("md5").update(username).digest("hex");

    // HEX to intarray
    var ints = hash.split("").map(function (char) {
        return parseInt(char, 16);
    });

    var invert = ints[0] % 2;

    // convert to mask
    var mask = ints.map(function (x) {
        return (x % 2 === invert);
    });

    // build 3x5 matrix
    var matrix = [];
    for (var y = 0; y < 5; y++) {
        matrix[y] = [];
        for (var x = 0; x < 3; x++) {
            matrix[y][x] = mask[1 + 3*y + x];
        }
    }

    // mirror horizontally
    var pixels = matrix.map(function (row) {
        return row.concat([row[1], row[0]]);
    });

    // generate RGB
    var red   = 16 * ints[16] + ints[17];
    var green = 16 * ints[18] + ints[19];
    var blue  = 16 * ints[20] + ints[21];

    // extract hue and use static sat and val
    var hue = rgb2hue(red, green, blue);
    var sat = 115;
    var val = 204;

    // convert to rgb
    var rgb = hsv2rgb(hue, sat, val);

    console.log("hsv", hue, sat, val);
    console.log("rgb", rgb);

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

function rgb2hue (r, g, b) {

    var hi = Math.max(r, g, b);
    var lo = Math.min(r, g, b);

    // achromatic - use the luminosity as hue
    if (hi === lo)
        return hi;

    var hue;

    // red ish
    if (hi === r)
        hue = (g - b) / (hi - lo) + (g < b ? 6 : 0);

    // green ish
    else if (hi === g)
        hue = (b - r) / (hi - lo) + 2;

    // blue ish
    else if (hi === b)
        hue = (r - g) / (hi - lo) + 4;

    // return as byte
    return Math.round(hue * 42.5);
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
