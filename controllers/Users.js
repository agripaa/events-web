const User = require('../models/Users');
const argon2 = require('argon2');
const path = require('path');
const fs = require('fs');

async function getDatas(req, res) {
    try {
        const result = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'password', 'image', 'url', 'role']
        });
        res.status(200).json({status:200, result});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
};

async function getDataById(req, res) {
    try {
        const result = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'password', 'image', 'url', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({status:200, result});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
};

async function createData(req, res) {
    const files = req.files;
    const { name, email, password, confPassword, role} = req.body;
    
    if(password !== confPassword) return res.status(400).json({msg:"password and confirm password do not match"});
    const hashPassword = await argon2.hash(password);

    if(files === null) return res.status(400).json({msg: "No file uploaded!"});
    const file = files.file;
    const size = file.data.length;
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedTypePhotos = [
        '.png',
        '.jpg',
        '.jpeg'
    ];

    if(!allowedTypePhotos.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"})
    if(size > 5000000) return res.status(422).json({msg: "image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err) => {
        if(err) return res.status(500).json({status: 500, msg:err})
        
        try {
            await User.create({
                name: name,
                email: email,
                password: hashPassword,
                image: fileName,
                url: url,
                role: role
            });
            res.status(200).json({status:200, msg: "data created!"});
        } catch (err) {
            console.error(err);
            res.status(500).json({status:500, err: err.message});
        }
    })
};

async function updateData(req, res) {
    let fileName, hashPassword;
    const files = req.files;
    const { name, email, password, confPassword, role} = req.body;

    const user = await User.findOne({where: {uuid: req.params.id}})
    if(!user) return res.status(404).json({status:404, msg: 'User not found'});

    if(password === null || password === ""){
        hashPassword = user.password;
    }else {
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg:"password and confirm password do not match"});

    if(files === null){
        fileName = User.image;
    }else {
        const file = files.file;
        const size = file.data.length;
        const ext = path.extname(file.name)
        fileName = file.md5 + ext;
        const allowedTypePhotos = [
            '.png',
            '.jpg',
            '.jpeg'
        ];
        
        if(!allowedTypePhotos.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid images"})
        if(size > 5000000) return res.status(422).json({msg: "image must be less than 5 MB"});

        file.mv(`./public/images/${fileName}`, async(err) => {
            if(err) return res.status(500).json({status: 500, msg:err})
        })
    }
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            image: fileName,
            url: url,
            role: role
        },{
            where: {
                id: user.id
            }
        });
        res.status(200).json({status:200, msg: "user updated succesfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
};

async function deleteData(req, res) {
    const user = await User.findOne({uuid: req.params.id});
    if(!user) return res.status(404).send({status: 404, msg: 'User not found'});

    try {
        await User.destroy({
            where: {id: user.id}
        })
        res.status(200).send({status: 200, msg:"user deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

module.exports = {
    getDatas,
    getDataById,
    createData,
    updateData,
    deleteData
};