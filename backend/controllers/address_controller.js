const Address = require('../models/address');
const Event = require('../models/event');

exports.createAddress = (req, res, next) => {
    const country = req.body.country;
    const event_id = req.body.event_id;
    const district = req.body.district;
    const province = req.body.province;
    const locationName = req.body.locationName;
    const forDirection = req.body.forDirection;
    const subLocality = req.body.subLocality;

    if(!country || !event_id || !district || !province || !locationName || !subLocality)
    {
        const error = new Error('All fields are required');
        error.statusCode = 404;
        throw error;
    }
    
    if(event_id == null){
        const error = new Error('Event id is required');
        error.statusCode = 404;
        throw error;
    }
    Event.findByPk(event_id).then(event => {
        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 404;
            throw error;
        }
    });

    
    Address.create({
        country: country,
        event_id: event_id,
        district: district,
        province: province,
        locationName: locationName,
        forDirection: forDirection,
        subLocality: subLocality

    })
        .then(result => {
            res.status(201).json({
                message: 'Address created successfully!',
                address: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getAddressByEventId = (req, res, next) => {
    const eventId = req.params.eventId;
    Address.findOne({ where: { event_id: eventId } }).then(result => {
        if (!result) {
            const error = new Error('Could not find address.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Fetched events.', address: result });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getAddress = (req, res, next) => {
    const addressId = req.params.addressId;
    Address.findByPk(addressId)
        .then(address => {
            if (!address) {
                const error = new Error('Could not find address.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Address fetched.', address: address });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
exports.updateAddress = (req, res, next) => {
    try{

      const country = req.body.country;
      const city= req.body.city;
      const state = req.body.state;
      const street = req.body.street;
      const postcode = req.body.postcode;
   
  
      const address =  Address.findByPk(req.params.id);
      address.country = country;
      address.city = city;
      address.state = state;
      address.street = street;
      address.postcode = postcode;
      
  
       address.save();
  
      res.status(200).json({
        message:"Address has been updated",
        result
      });
  
    }catch(error){
       res.status(401).json({
         message:"Address has not been updated",
         error
      });
      console.log(error);
    }
  }

  