#!/usr/bin/env node

const fs = require('fs');
const im = require('easyimage');
const path = require('path');
const zip = require('zip-folder');

const srcDir = __dirname + '/src';
const imgDir = srcDir + '/img';
const iconPath = imgDir + '/icon-bomb.png';
const manifestPath = srcDir + '/manifest.json';
const archivePath = __dirname + '/dist/chrome-nuke.zip';

const iconSizes = [ 16, 48, 128 ];

var manifest = JSON.parse(fs.readFileSync(manifestPath));

const taskDefinitions = {
    icons: function() {
        console.log('Resizing icons...');
        
        var iconExt = path.extname(iconPath);
        var iconBase = path.basename(iconPath, iconExt);
        var iconDir = path.dirname(iconPath);

        var promises = [];
        
        if(!manifest.icons) {
            manifest.icons = {};
        }

        for(var i = 0; i < iconSizes.length; i++) {
            var iconSize = iconSizes[i];
            var resizedIconPath = iconDir + '/' + iconBase + '-' + iconSize + iconExt;

            console.log('Creating ' + resizedIconPath);

            promises.push(im.resize({
                src: iconPath,
                dst: resizedIconPath,
                width: iconSize,
                height: iconSize
            }).then(function(createdImage) {
                console.log(createdImage.name + ' created.');
            }));
            
            console.log('Updating manifest entry...');
            
            manifest.icons[iconSize.toString()] = path.relative(srcDir, resizedIconPath);
        }

        return Promise.all(promises).then('Icons resized.');
    },
    zip: function() {
        return new Promise(function(fulfill, reject) {
            console.log('Generating archive...');

            zip(srcDir, archivePath, function(error) {
                if(error) {
                    reject(error);
                } else {
                    console.log('Archive complete.');
                    fulfill(archivePath);
                }
            });
        });
    }
};

var tasks;

if(process.argv.length > 2) {
    tasks = process.argv.slice(2);
} else {
    tasks = [
        'icons',
        'zip'
    ];
}

console.log('Running ' + tasks.length + ' task(s)...');

var promises = [];

for(var i = 0; i < tasks.length; i++) {
    promises.push(taskDefinitions[tasks[i]]());
}

Promise.all(promises).then(function() {
    console.log(tasks.length + ' task(s) completed.');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
});