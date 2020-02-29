const https = require('https');

//Vars
let token = null,
    baseURL = 'www.freeriderhd.com';

//Functions
function err(info) {
    //console.log(`Error: ${info}`);
    ret(!1, !1, `Error: ${info}`);
}

function ret(tf, d = !1, ms = !1) {
    return { status: tf, data: d, msg: ms }
}

function request(method, path, body, callback) {
    let err,
        options = {
            hostname: baseURL,
            port: 443,
            path: path,
            method: method
        };
    options.headers = method == 'POST' ? {
        'Content-Type': 'application/x-www-form-urlencoded',
        'carset': 'UTF-8'
    } : {
            'Content-Type': 'application/json; charset=utf-8'
        };

    const req = https.request(options, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', data => body += data);
        res.on('end', () => {
            //const resp = JSON.parse(body);
            callback(err, body)
        });
    });

    req.on('error', e => err = e);

    if (body !== void 0)
        req.write(`${body}&ajax=!0&app_signed_request=${token}&t_1=ref&t_2=desk`);
        //else req.write(`ajax=!0&t_1=ref&t_2=desk`)

    req.end();
}

function t2t(ticks) {
    let t = ticks / 30 * 1e3;
    t = parseInt(t, 10);
    let e = (t / 6e4) | 0
        , i = (t - 6e4 * e) / 1e3;
    return i = i.toFixed(2),
        10 > e && (e = e),
        10 > i && (i = "0" + i),
        e + ":" + i
}

//JSDoc Stuff
/**
 * Callback for all funtions
 * 
 * @callback RequestCallback
 * @param {Object<{status: boolean, data: JSON, msg: string}>} - Json object with status, data, and message (this requires only one param)
 */

//Exports
class FRHD {
    /**
     * Starts the mod
     * @constructor
     */
    constructor() {
        this.token = null,
            this.user = null;
    }

    /**
     * Gets info about a user from name.
     * Does not require login
     * @param {string} uName - Username of user
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    getUserData(uName, cb = () => { }) {
        if (!uName || typeof uName !== 'string') return err('Invalid arguments');
        request('GET', `/u/${uName}?ajax=true`, void 0,
            (err, data) => {
                data = JSON.parse(data);
                if (err) return err(err);
                if (!data.user) return ret(!1, !1, `No user by the name of "${uName}"`);
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    //Account
    /**
     * Verifies Login
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    loginVerify(cb = () => { }) {
        if (!this.token) return err('You are not logged in');
        request('GET', `/datapoll/poll_request`, `notifications=!0`,
            (err, data) => {
                if (err) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Sets token.
     * Does not require login
     * @param {string} asr - Account token (ask Goodra how to obtain)
     */
    login(asr = '', cb = () => { }) {
        if (!asr || typeof asr !== 'string') return err('Invalid arguments');
        this.token = asr;
        token = asr;
        cb();
    }
    /**
     * Logs you out
     */
    logout() {
        if (!this.token) return err('You are not logged in');
        this.token = null,
            this.user = null,
            token = null;
    }
    /**
     * Changes your account name
     * @param {string} name - New name
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    changeName(name, cb = () => { }) {
        if (!name || typeof name !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/account/edit_profile', `name=u_name&value=${encodeURIComponent(name)}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Changes your description
     * @param {string} desc - New description
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    changeDesc(desc, cb = () => { }) {
        if (!desc || typeof desc !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/account/edit_profile', `name=about&value=${encodeURIComponent(desc).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Sets password
     * @param {string} oldpass - Old password
     * @param {string} newpass - New password
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    changePassword(oldpass, newpass, cb = () => { }) {
        if (!newpass || typeof newpass !== 'string' || !oldpass || typeof oldpass !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/account/change_password', `old_password=${encodeURIComponent(oldpass).replace('%20', '+')}&new_password=${encodeURIComponent(newpass).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Changes forum password
     * @param {string} pass - Password
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    forumPass(pass, cb = () => { }) {
        if (!pass || typeof pass !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/account/update_forum_account', `password=${encodeURIComponent(pass).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Buys a hat
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    buyHat(cb = () => { }) {
        if (!this.token) return err('You are not logged in');
        request('POST', '/store/buy', '',
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Equips a hat
     * @param {number} hatId - ID of hat
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    equipHat(hatId, cb = () => { }) {
        if (!hatId || typeof hatId !== 'number') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/store/equip', `item_id=${hatId}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Gets data about the track.
     * Does not require login
     * @param {number} tId - ID of track
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    getTrackData(tId, cb = () => { }) {
        if (!tId || typeof tId !== 'number') return err('Invalid arguments');
        request('GET', `/t/${tId}?ajax=true`, '',
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Leaves a comment on a track
     * @param {number} tId - ID of the track
     * @param {string} msg - Message Of comment
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    comment(tId, msg, cb = () => { }) {
        if (!tId || typeof tId !== 'number' || !msg || typeof msg !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        request('POST', '/track_comments/post', `t_id=${tId}&msg=${encodeURIComponent(msg).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
}


module.exports = FRHD;
