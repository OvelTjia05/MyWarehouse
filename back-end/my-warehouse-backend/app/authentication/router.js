const express = require('express');
const router = express.Router();
const authenticationController = require('./controller');

router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);
router.put('/', authenticationController.updateAccessToken);
router.post('/logout', authenticationController.logout);

module.exports = router;
