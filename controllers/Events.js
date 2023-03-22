const Events = require('../models/Events');
const User = require('../models/Users');
const convertRupiah = require('rupiah-format');
const Op = require('sequelize');
const path = require('path');

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

async function getDatas(req, res){
    let result;
    try {
        if(req.role === 'admin'){
            result = await Events.findAll({
                attributes: attributes,
                include:[{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            });
        }else{
            result = await Events.findAll({
                where: {userId: req.userId},
                attributes: attributes,
                include:[{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            });
        }
        console.log(result)
        res.status(200).json({status:200, result});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function getDataById(req, res){
    const event = await Events.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!event) return res.status(404).json({status:404, msg: "event not found"});
    let result;
    try {
        if(req.role === "admin"){
            result = await Event.findOne({
                attributes: attributes,
                where: { id: event.id },
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            })
            res.status(200).json({status: 200, result})
        }else {
            result = await Event.findOne({
                [Op.and]: [{ id: event.id }, { userId: req.userId }],
                attributes: attributes,
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            })
            res.status(200).json({status: 200, result})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, msg: err.message});
    }
}

async function createData(req, res){
    const files = req.files;
    const { 
        name,
        desc,
        date,
        register,
        content,
        price,
        more_information 
    } = req.body;
    
    let priceConvert = convertRupiah.convert(price);
    
    if(priceConvert === "Rp. ,00" || priceConvert === "Rp. 0,00") {
        
    }

    if (!files) return res.status(404).json({status: 404, msg: 'No file Uploaded'})
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
        try {
            if(err) return res.status(500).json({msg: err.message});
            Events.create({
                name: name,
                desc: desc,
                date: date,
                register: register,
                content: content,
                price: priceConvert,
                more_information: more_information,
                image: fileName,
                url: url,
                userId: req.userId
            })
            res.status(200).json({status: 200, msg: "content uploaded successfully"})
        } catch (err) {
            console.error(err);
            res.status(500).json({status:500, err: err.message});
        }
    })
}

async function updateData(req, res){
    let fileName;
    const files = req.files;
    const { 
        name,
        desc,
        date,
        register,
        content,
        price,
        more_information 
    } = req.body;
    const priceConvert = convertRupiah.convert(price)

    const event = await Events.findOne({uuid: req.params.id})
    if(!event) return res.status(404).json({status: 404, msg: 'Event not found'});

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
        await Events.update({
                name: name,
                desc: desc,
                date: date,
                register: register,
                content: content,
                price: priceConvert,
                more_information: more_information,
                image: fileName,
                url: url,
                userId: req.userId
        },{
            where: {
                id: event.id
            }
        })
        res.status(200).json({status: 200, msg: 'event updated successfully'})
    } catch (err) {
        console.error(err);
        res.status(500).json({status:500, err: err.message});
    }
}

async function deleteData(req, res){
    const event = await Events.findOne({uuid: req.params.id})
    if(!event) return res.status(404).json({status:404, msg: 'Event not found'});
    try {
        await Events.destroy({
            where: {id: event.id}
        });
        res.status(200).json({status:200, msg: 'Event deleted successfully'});
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