const fr = require('../FRHD.js');
const FRHD = new fr();

FRHD.login('Put account token here');

FRHD.getTrackData(parseInt(Array.from(arguments)[0]), val => {
    if (!val.status) return console.log(`ERROR: ${val.msg}\n----------\nData: ${val.data}`);
    console.log(`Sucuess: ${val.msg}\n----------\nData: ${val.data}`)
});
