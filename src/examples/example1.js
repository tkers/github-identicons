/**
 * GitHub-Identicons - example script
 *
 * Copyright(c) 2014 Tijn Kersjes
 * All rights reserved.
 */

// dependency
var fs  = require("fs");
var PNG = require("pngjs").PNG;
var createIdenticon = require("../index");

// create some files to try it out!
var time = new Date().getTime();
var n = 5;

// n goes to zero
while (n --> 0) {

    var username = (time - n).toString();
    var identicon = createIdenticon(username);
    save(identicon, username + ".png");

    console.log(username + ".png");
}

// write an identicon to PNG file
function save(identicon, fname) {

    // size of every 'pixel'
    var scale = 50;

    // background colour
    var bg = {
        r : 242,
        g : 242,
        b : 242
    };

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
                colour = identicon.mask[yy][xx] ? identicon.color : bg;

            png.data[i]   = colour.r;
            png.data[i+1] = colour.g;
            png.data[i+2] = colour.b;
            png.data[i+3] = 255;
        }
    }

    // write image to file
    var out = fs.createWriteStream(fname);
    png.pack().pipe(out);
}
