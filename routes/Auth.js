const express = require('express');
const { 
    Login,
    Profile,
    LogOut
} = require('../controllers/Auth');

const router = express.Router();

router.get('/profile', Profile);
router.post('/login', Login);
router.delete('/logout', LogOut);

module.exports = router;