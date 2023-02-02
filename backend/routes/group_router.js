const express=require('express');
const groupController= require('../controllers/group_controller');

const router=express.Router();

router.get('/group',groupController.getGroups);
router.get('/group/:groupId',groupController.getGroup);
router.post('/group',groupController.createGroup);
router.put('/group/:groupId',groupController.updateGroup);
router.delete('/group/:groupId',groupController.deleteGroup);

module.exports=router;


