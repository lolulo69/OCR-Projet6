const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');


//Déclaration de toutes les routes users stockées dans le controller user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;