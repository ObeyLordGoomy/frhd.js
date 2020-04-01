# frhd.js
A lightweight tool for interacting with FreeRiderHD that has no dependencies.

Allows api calls and track managemnet.

Example script for api calls
```const fr = require('frhd.js');
const FRHD = new fr.user();

FRHD.getTrackData(700000, ({status, data, msg}) => {
    if (!status) return console.log(`ERROR: ${msg}\n----------\nData: ${data}`);
    console.log(`Sucuess: ${msg}\n----------\nData: ${data}`)
});

console.log('=======================')

FRHD.getUserData('yv3l', ({status, data, msg}) => {
    if (!status) return console.log(`ERROR: ${msg}\n----------\nData: ${data}`);
    console.log(`Sucuess: ${msg}\n----------\nData: ${data}`)
});
```
Example script for track editing
```const fr = require('../index.js');
const track = new fr.track();

const code = '-18 1i 18 1i,-5a -1i -2q -34,2q -18 68 -18 a -3o -u -50,26 -18 -5a -1i,a -3o 26 -18,2q -18 -2q -34,-1s -26 k -34,42 -42 -u -50,42 -42 k -34##'

track.import(code, 20, 20);
track.addAntigravity(20, -40);
track.addTarget(30, 30);
track.addPhysicsLine(-100, -100, -100, 90, 100, 95);
console.log(track.code);```
