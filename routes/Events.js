const express = require('express');
const { getDatas, getDataById, createData, updateData, deleteData } = require('../controllers/Events');

const router = express.Router();

router.get('/events', getDatas);
router.get('/events/:id', getDataById);
router.post('/events', createData);
router.patch('/events/:id', updateData);
router.delete('/events/:id', deleteData);

module.exports = router;