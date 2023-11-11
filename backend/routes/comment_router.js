const express=require('express');
const comment_controller= require('../controllers/comment_controller');

const router=express.Router();


router.post('/createComment',comment_controller.createComment);
router.get('/getcomments/:eventId',comment_controller.getComment);


module.exports=router;