const { nanoid } = require('nanoid');
const SessionID = require('../models/sessionID');

function setSession(req, res, next) {
    let id = nanoid();
    if (!req.signedCookies.sessionId) {
        res.cookie('sessionId', id, {
            signed: true
        });
        const newSessionID = new SessionID({
            sessionId: id,
            cart: { },
            totalProducts: 0,
        })
        newSessionID.save( (err) => {
            if (err)
                console.log(err);
        })
    }
    next();
}

module.exports = setSession;