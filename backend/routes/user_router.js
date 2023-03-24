const express=require('express');
const userController=require('../controllers/user_controller');
const router=express.Router();

router.get('/user/userInfo',userController.getUser);
router.post("/user/userUpdate", userController.updateUser);
module.exports=router;