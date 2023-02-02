const express=require('express');
const detailController= require('../controllers/detail_controller');

const router=express.Router();

router.get('/detail',detailController.getDetails);
router.get('/detail/:detailId',detailController.getDetail);
router.post('/detail',detailController.createDetail);
router.put('/detail/:detailId',detailController.updateDetail);
router.delete('/detail/:detailId',detailController.deleteDetail);

module.exports=router;