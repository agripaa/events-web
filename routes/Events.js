const express = require('express');
const { getDatas, getDataById, createData, updateData, deleteData } = require('../controllers/Events');
const { verifyUser } = require('../middleware/AuthUser');
const router = express.Router();

router.get('/events', verifyUser, getDatas);
router.get('/events/:id', verifyUser, getDataById);
router.post('/events', verifyUser, createData);
router.patch('/events/:id', verifyUser, updateData);
router.delete('/events/:id', verifyUser, deleteData);

module.exports = router;