
const express = require('express');
const router = express.Router();
const passwordController=require('../controllers/password_controller');


// router.post('/user/forgot', passwordController.forgotPassword);
router.post('/password/codeSender', passwordController.codeSender);
router.post('/password/verifyCode', passwordController.verifyCode);
router.post('/password/reset', passwordController.resetPassword);

module.exports = router;
