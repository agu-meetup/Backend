const express=require('express');
const authController=require('../controllers/auth_controller');


const router=express.Router();

//add a new user - signup for user
router.post('/user/userSignup',authController.userSignup);
//User login
router.post("/user/userLogin",authController.userLogin);


module.exports=router;