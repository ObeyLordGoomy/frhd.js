# frhd.js
FreeRiderHD api client for node.js by GoodraFRHD

Example script
```const fr = require('../index.js');
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
