const Events = require('../models/Events');
const User = require('../models/Users');
const Op = require('sequelize');

async function getDatas(req, res){
    let result;
    const attributes = [
        'uuid',
        'name',
        'desc',
        'date',
        'register',
        'content',
        'price',
        'more_information'
    ]
    try {
        if(req.role === 'admin'){
            result = await Events.findAll({
                attributes: attributes,
                include:[{
                    model: User,
                    attributes: ['name', 'email', 'url']
                }]
            });
        }else{
            result = await Events.findAll({
                where: {userId: req.userId},
                attributes: attributes,
                include:[{
                    model: User,
                    attributes: ['name', 'email', 'url']
                }]
            });
        }
        res.status(200).json({status:200, result});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function getDataById(req, res){
    try {
        
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function createData(req, res){
    try {
        
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function updateData(req, res){
    try {
        
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function deleteData(req, res){
    try {
        
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