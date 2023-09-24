const express=require('express');
const addressController= require('../controllers/address_controller');

const router=express.Router();


router.get('/fetchAddress/:addressId',addressController.getAddress);
router.get('/fetchAddressByEventId/:eventId',addressController.getAddressByEventId);
router.post('/createAddress',addressController.createAddress);
router.put('/updateAddress/:addressId',addressController.updateAddress);

module.exports=router;