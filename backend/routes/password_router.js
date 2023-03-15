
const express = require('express');
const router = express.Router();
const passwordController=require('../controllers/password_controller');


router.post('/user/forgot', passwordController.forgotPassword);
router.post('/user/reset', passwordController.resetPassword);

module.exports = router;
