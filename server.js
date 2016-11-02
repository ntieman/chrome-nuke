#!/usr/bin/env node

const express = require('express');

var app = false;

function start() {
    if(!app) {
        app = express();
        app.use('/', express.static(__dirname + '/static'));
    }
    
    if(!module.exports.listening) {
        app.listen(3000);
        module.exports.listening = true;
    }
}

function stop() {
    app.quit();
    module.exports.listening = false;
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.listening = false;

if(require.main === module) {
    start();
}