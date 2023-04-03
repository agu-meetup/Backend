const express = require('express');
const eventController = require('../controllers/event_controller');

const router = express.Router();

router.get('/event', eventController.getEvents);
router.get('/event/:eventId', eventController.getEvent);
router.get('/event/saveevent/:userid', eventController.getSavedEventsByUserId);
router.post('/event/saveevent/:userid', eventController.saveEventByUserId);
router.post('/event', eventController.createEvent);
router.put('/event/:eventId', eventController.updateEvent);
router.put('/event/:eventId/time', eventController.updateTime);
router.put('/event/:eventId/location', eventController.updateLocation);
router.put('/event/:eventId/detail', eventController.updateDetails);
router.put('/event/:eventId/users', eventController.updateUsers);
router.put('/event/:eventId/image', eventController.updateImgUrl);


router.delete('/event/:eventId', eventController.deleteEvent);
router.delete('/event/saveevent/:userid', eventController.getSavedEventsByUserId);
router.get('/event/user/:userId', eventController.getEventsByUser);
router.get('/event/category/:category', eventController.getEventsByCategory);
router.get('/event/parameter/:parameter', eventController.getEventsByParameter);
router.get('/event/group/:groupId', eventController.getEventsByGroup);
router.get('/event/categories/:categories', eventController.getEventsByCategories);
router.get('/event/UserEvents/:userId', eventController.getUserEventsByUserId);

router.post('/event/:eventId/user/:userId', eventController.joinEvent);



module.exports = router;