const fr = require('../index.js');
const track = new fr.track();

const code = '-18 1i 18 1i,-5a -1i -2q -34,2q -18 68 -18 a -3o -u -50,26 -18 -5a -1i,a -3o 26 -18,2q -18 -2q -34,-1s -26 k -34,42 -42 -u -50,42 -42 k -34##'

track.import(code, 20, 20);
track.addAntigravity(20, -40);
track.addTarget(30, 30);
track.addPhysicsLine(-100, -100, -100, 90, 100, 95);
console.log(track.code);