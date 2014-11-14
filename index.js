/**
 * GitHub-Identicons
 *
 * Copyright(c) 2014 Tijn Kersjes
 * All rights reserved.
 */

// dependencies
var crypto = require("crypto");
var fs  = require("fs");
var PNG = require("pngjs").PNG;


function createIdenticon(username) {

    // get MD5 hash of username in HEX format
    var hash = crypto.createHash("md5").update(username).digest("hex");

    // HEX to intarray
    var ints = hash.split('').map(function (char) {
        return parseInt(char, 16);
    });

    var invert = ints[15] % 2;

    // convert to mask
    var mask = ints.map(function (x) {
        return (x % 2 === invert);
    });

    // build 3x5 matrix
    var matrix = [
        [mask[0], mask[1], mask[2]],
        [mask[3], mask[4], mask[5]],
        [mask[6], mask[7], mask[8]],
        [mask[9], mask[10], mask[11]],
        [mask[12], mask[13], mask[14]]
    ];

    // mirror horizontally
    var pixels = matrix.map(function (row) {
        return row.concat([row[1], row[0]]);
    });

    // get RGB
    var r = 16 * ints[16] + ints[17];
    var g = 16 * ints[18] + ints[19];
    var b = 16 * ints[20] + ints[21];

    // calculate hue
    var hi = Math.max(r, g, b);
    var lo = Math.min(r, g, b);
    var hue;

    // achromatic - use the luminosity as hue
    if (hi === lo) {
        hue = hi;
    }

    else {

        // red ish
        if (hi === r)
            hue = (g - b) / (hi - lo) + (g < b ? 6 : 0);

        // green ish
        else if (hi === g)
            hue = (b - r) / (hi - lo) + 2;

        // blue ish
        else if (hi === b)
            hue = (r - g) / (hi - lo) + 4;

        hue *= 42.5;
    }

    // fixed saturation and brightness
    var sat = 115;
    var val = 204;

    // back to rgb again
    var rgb = HSVtoRGB(hue / 255, sat / 255, val / 255);

    // return the pixels and colour
    return {
        pixels : pixels,
        colour : {
            red    : rgb.r * 255,
            green  : rgb.g * 255,
            blue   : rgb.b * 255
        }
    };
}

function HSVtoRGB(h, s, v) {

    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function saveIdenticon(img, fname) {

    // size of every 'pixel'
    var scale = 50;

    // background colour
    var bg = {
        red : 242,
        green : 242,
        blue : 242
    }

    // create PNG
    var png = new PNG({
        filterType: -1,
        width : 6 * scale,
        height : 6 * scale
    });

    // create image buffer from identicon
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var i = (png.width * y + x) << 2;

            var xx = Math.floor((x - scale / 2) / scale);
            var yy = Math.floor((y - scale / 2) / scale);

            var colour = bg;
            if (xx >= 0 && xx < 5 && yy >= 0 && yy < 5)
                colour = img.pixels[yy][xx] ? img.colour : bg;

            png.data[i]   = colour.red;
            png.data[i+1] = colour.green;
            png.data[i+2] = colour.blue;
            png.data[i+3] = 255;
        }
    }

    // write image to file
    var out = fs.createWriteStream(fname);
    png.pack().pipe(out);
}

/** ------------------------------ **/

// create some files to try it out!
var time = new Date().getTime();
var n = 5;

// n goes to zero
while (n --> 0) {

    var username = (time - n).toString();
    var identicon = createIdenticon(username);
    saveIdenticon(identicon, username + ".png");

    console.log(username + ".png");
}