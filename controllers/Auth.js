const User = require('../models/Users');
const argon2 = require('argon2');

async function Login(req, res) {
    const user = await User.findOne({
        where: { email: req.body.email }
    });
    if(!user) return res.status(404).json({status: 404, msg: "user not found"});

    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({status: 400, msg: "wrong password"});

    req.session.userId = user.uuid;
    const { uuid, name, email, url, role } = user;
    res.status(200).json({uuid, name, email, url, role});
}

async function Profile(req, res){
    if(!req.session.userId) return res.status(401).json({status:401, msg: "Please login your account"})
    const user = await User.findOne({
        attribute: ['uuid', 'name', 'email', 'url', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({status: 404, msg: 'User not found'});
    res.status(200).json({status: 200, user});
}

async function LogOut(req, res){
    req.session.destroy(err => {
        if (err) return res.status(400).json({status:400, err: err.message})
        res.status(200).json({status:200, msg: "you have logged out"})
    })
}

module.exports = {
    Login,
    Profile,
    LogOut
}