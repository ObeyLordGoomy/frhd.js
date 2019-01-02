const req = require('request');

//Vars
let baseURL = 'https://www.freeriderhd.com/';

//Functions
function err(info) {
    console.log(`Error: ${info}`);
    ret(!1, !1, `Error: ${info}`);
}
function ret(tf, d = !1, ms = !1) {
    return { status: tf, data: d, msg: ms }
}
function rData(path, body, cookie) {
    return {
        headers: cookie ? { 'content-type': 'application/x-www-form-urlencoded', 'cookie': cookie } : { 'content-type': 'application/x-www-form-urlencoded' },
        url: baseURL + path,
        body: body,
        json: true
    }
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
        req(rData(`u/${uName}?ajax=true`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
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
        req(rData(`?ajax=true`, `frhd_app_sr=${this.token}`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Sets token.
     * Does not require login
     * @param {string} token - Account token (ask Goodra how to obtain)
     */
    login(token = '') {
        if (!token || typeof token !== 'string') return err('Invalid arguments');
        this.token = token;
    }
    /**
     * Logs you out
     */
    logout() {
        if (!this.token) return err('You are not logged in');
        this.token = null,
            this.user = null;
    }
    /**
     * Changes your account name
     * @param {string} name - New name
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    changeName(name, cb = () => { }) {
        if (!name || typeof name !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        req.post(rData(`account/edit_profile?name=u_name&value=${name}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
        req.post(rData(`account/edit_profile?name=about&value=${desc}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
        req.post(rData(`account/change_password?old_password=${oldpass}&new_password=${newpass}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
    forumPass(pass) {
        if (!pass || typeof pass !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        req(rData(`account/update_forum_account?password=${pass}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
        req.post(rData(`store/buy?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
        req.post(rData(`store/equip?item_id=${hatId}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                if (!data.user) return ret(!1, !1, `Token is invalid or you are not logged in`);
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
        req(rData(`t/${tId}?ajax=true`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
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
    comment(msg, cb = () => { }) {
        if (!tId || typeof tId !== 'number' || !msg || typeof msg !== 'string') return err('Invalid arguments');
        if (!this.token) return err('You are not logged in');
        req.post(rData(`track_comments/post?t_id=${tId}&msg=${msg}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                this.user = data.user;
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
    /**
     * Gets the ghost of a user on a track.
     * Does not require login
     * @param {number} tId - ID of the track
     * @param {number} uId - ID of the user
     * @param {RequestCallback} [cb = () => {}] - Callback
     */
    race(tId, uId, cb = () => { }) {
        if (!tId || typeof tId !== 'number' || !uId || typeof uId !== 'number') return err('Invalid arguments');
        req(rData(`track_api/load_races?t_id=${tId}&u_ids=${uId}&ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`),
            (err, response, data) => {
                if (err && response.statusCode !== 200) return err(err);
                cb(ret(!0, data, data.msg ? data.msg : 'Sucuess!'));
            }
        );
    }
}


module.exports = FRHD;
