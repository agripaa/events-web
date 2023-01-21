const express = require('express');
const { getDatas, getDataById, createData, updateData, deleteData } = require('../controllers/Users');

const router = express.Router();

router.get('/users', getDatas);
router.get('/users/:id', getDataById);
router.post('/users', createData);
router.patch('/users/:id', updateData);
router.delete('/users/:id', deleteData);

module.exports = router;