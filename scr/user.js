const https = require('https'),
    EventEmitter = require('events');

//Vars
let token = null,
    baseURL = 'www.freeriderhd.com';

//Functions
function error(info) {
    return ret(!1, !1, `Error: ${info}`);
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
            callback(err, body)
        });
    });

    req.on('error', e => err = e);

    if (body !== void 0)
        req.write(`${body}&ajax=!0&app_signed_request=${token}&t_1=ref&t_2=desk`);

    req.end();
}

//JSDoc Stuff
/**
 * Callback for all funtions
 * 
 * @callback RequestCallback
 * @param {Object<{status: boolean, data: JSON, msg: string}>} - Json object with status, data, and message (this requires only one param)
 */

//Exports
class user extends EventEmitter {
    /**
     * Sets up the class
     * @constructor
     * @param {number} [pingInterval = 60] - amount in seconds between pings (greater or equal to 30)
     * @param {string} [connectionURL = 'www.freeriderhd.com'] - for custom servers
     */
    constructor(pingInterval = 60, connectionURL = 'www.freeriderhd.com') {
        super();
        pingInterval < 30 && (pingInterval = 30);
        this.pingInterval = pingInterval * 1000,
            this.token = null,
            this.user = null,
            this._getNotifs,
            this._notification_count,
            this.latestNotification;
        baseURL = connectionURL;
        this.on('newListener', (event, listener) => {
            if (event != 'notification') return;
            if (!this.token) return;
            this._getNotifs = setInterval(() => {
                this.datapoll(({ status, data, msg }) => {
                    if (!status || data.notification_count == 0) return;
                    this.notification_count = data.notification_count;
                    this.getNotifications(({ status, data, msg }) => {
                        let notifications = [];;
                        for (const key in data.notification_days) {
                            if (data.notification_days.hasOwnProperty(key)) {
                                const element = data.notification_days[key];
                                for (const iterator of element.notifications) {
                                    //work here
                                    if (notifications.length == this.notification_count) break;
                                }
                            }
                            if (notifications.length == this.notification_count) break;
                        }
                        notifications.forEach(notif => this.emit('notification', notif))
                    });
                });
            });
        }, pingInterval);
    }
    /**
     * Gets the connection url
     */
    get connectionURL() {
        return baseURL
    }
    
    /**
     * Gets info about a user from name.
     * Does not require login
     * @param {string} uName - Username of user
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    getUserData(uName, cb = () => { }) {
        if (!uName || typeof uName !== 'string') return error('Invalid arguments');
        request('GET', `/u/${uName.replace(/[^A-Z0-9_\.]/ig, "")}?ajax=true`, void 0,
            (err, data) => {
                data = JSON.parse(data);
                if (err) return cb(error(err));
                if (!data.user) return cb(ret(!1, !1, `No user by the name of "${uName}"`));
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
        if (!this.token) return cb(error('You are not logged in'));
        request('GET', `/?ajax=!0&app_signed_request=${this.token}`, void 0,
            (err, data) => {
                if (err) return cb(error(err));
                data = JSON.parse(data);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Gets your user data
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    getMyUser(cb = () => { }){
        if (!this.token) return cb(error('You are not logged in'));
        this.loginVerify(({status, data, msg}) => {
            if(!status) return cb(error(msg));
            this.getUserData(this.user.d_name, ({status, data, msg}) => {
                if(!status) return cb(error(msg));
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            })
        });
    }
    /**
     * Sets token.
     * Does not require login
     * @param {string} asr - your FRHD app_signed_request
     */
    login(asr = '', cb = () => { }) {
        if (!asr || typeof asr !== 'string') return cb(error('Invalid arguments'));
        this.token = asr;
        token = asr;
        cb();
    }
    /**
     * Logs you out
     */
    logout() {
        if (!this.token) return cb(error('You are not logged in'));
        this.token = null,
            this.user = null,
            token = null;
    }
    /**
     * Gets a datapoll
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    datapoll(cb = () => { }) {
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/datapoll/poll_request', 'notifications=true',
            (err, data) => {
                if (err !== void 0) return cb(error(err));
                data = JSON.parse(data);
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Gets notifications
     * @param {number} tId - ID of track
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    getNotifications(cb = () => { }) {
        if (!tId || typeof tId !== 'number') return cb(error('Invalid arguments'));
        request('GET', `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`, void 0,
            (err, data) => {
                data = JSON.parse(data);
                if (err) return cb(error(err));
                //if (!data.track) return cb(ret(!1, !1, `No track with the id of "${tId}"`));
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Changes your account name
     * @param {string} name - New name
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    changeName(name, cb = () => { }) {
        if (!name || typeof name !== 'string') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/account/edit_profile', `name=u_name&value=${encodeURIComponent(name.replace(/[^A-Z0-9]/ig, ""))}`,
            (err, data) => {
                data = JSON.parse(data);
                if (err !== void 0) return cb(error(err));
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
        if (!desc || typeof desc !== 'string') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/account/edit_profile', `name=about&value=${encodeURIComponent(desc).replace('%20', '+')}`,
            (err, data) => {
                data = JSON.parse(data);
                if (err !== void 0) return cb(error(err));
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
        if (!newpass || typeof newpass !== 'string' || !oldpass || typeof oldpass !== 'string') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/account/change_password', `old_password=${encodeURIComponent(oldpass).replace('%20', '+')}&new_password=${encodeURIComponent(newpass).replace('%20', '+')}`,
            (err, data) => {
                data = JSON.parse(data);
                if (err !== void 0) return cb(error(err));
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
        if (!pass || typeof pass !== 'string') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/account/update_forum_account', `password=${encodeURIComponent(pass).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return cb(error(err));
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
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/store/buy', '',
            (err, data) => {
                if (err !== void 0) return cb(error(err));
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
        if (!hatId || typeof hatId !== 'number') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/store/equip', `item_id=${hatId}`,
            (err, data) => {
                if (err !== void 0) return cb(error(err));
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
        if (!tId || typeof tId !== 'number') return cb(error('Invalid arguments'));
        request('GET', `/t/${tId}?ajax=true`, void 0,
            (err, data) => {
                data = JSON.parse(data);
                if (err) return cb(error(err));
                if (!data.track) return cb(ret(!1, !1, `No track with the id of "${tId}"`));
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    getRandomTrack(cb = () => { }) {
        request('GET', `/random/track`, void 0,
            (err, data) => {
                data = JSON.parse(data);
                if (err) return cb(error(err));
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
        if (!tId || typeof tId !== 'number' || !msg || typeof msg !== 'string') return cb(error('Invalid arguments'));
        if (!this.token) return cb(error('You are not logged in'));
        request('POST', '/track_comments/post', `t_id=${tId}&msg=${encodeURIComponent(msg).replace('%20', '+')}`,
            (err, data) => {
                if (err !== void 0) return cb(error(err));
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
}


module.exports = user;