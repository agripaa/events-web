const express = require('express');
const { getDatas, getDataById, createData, updateData, deleteData } = require('../controllers/Users');
const { verifyUser, adminOnly } = require('../middleware/AuthUser');

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getDatas);
router.get('/users/:id', verifyUser, adminOnly, getDataById);
router.post('/users', verifyUser, adminOnly, createData);
router.patch('/users/:id', verifyUser, adminOnly, updateData);
router.delete('/users/:id', verifyUser, adminOnly, deleteData);

module.exports = router;