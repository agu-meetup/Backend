const express=require('express');
const addressController= require('../controllers/address_controller');

const router=express.Router();


router.get('/fetchAddress/:addressId',addressController.getAddress);
router.post('/createAddress',addressController.createAddress);
router.post('/updateAddress/:addressId',addressController.updateAddress);

module.exports=router;