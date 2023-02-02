const express=require('express');
const eventController= require('../controllers/event_controller');

const router=express.Router();

router.get('/event',eventController.getEvents);
router.get('/event/:eventId',eventController.getEvent);
router.post('/event',eventController.createEvent);
router.put('/event/:eventId',eventController.updateEvent);
router.delete('/event/:eventId',eventController.deleteEvent);

module.exports=router;