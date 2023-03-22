const User = require('../models/Users');

async function verifyUser(req, res, next) {
    if(!req.session.userId) return res.status(404).json({status: 404, msg: "Please Login your account"});
    const user = await User.findOne({
        attribute: ['uuid','name', 'email', 'url', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({status: 404, msg: "User not found"});
    req.userId = user.id;
    req.role = user.role;
    return next();
}

async function adminOnly(req, res, next) {
    const user = await User.findOne({
        attribute: ['uuid','name', 'email', 'url', 'role'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({status: 404, msg: 'User not found'});
    if(user.role !== 'admin') return res.status(403).json({status: 403, msg: 'Role does not exist'});
    return next();
}

module.exports = {
    verifyUser,
    adminOnly
}