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
exports.updateAddress = (req, res, next) => {
    const country = req.body.country;
    const event_id = req.body.event_id;
    const district = req.body.district;
    const province = req.body.province;
    const locationName = req.body.locationName;
    const forDirection = req.body.forDirection;
    const subLocality = req.body.subLocality;
    const addressId = req.params.addressId;
  
    Address.findByPk(addressId)
      .then((address) => {
        if (!address) {
          return res.status(404).json({ message: 'Address not found' });
        }
  
        address.country = country;
        address.event_id = event_id;
        address.district = district;
        address.province = province;
        address.locationName = locationName;
        address.forDirection = forDirection;
        address.subLocality = subLocality;
  
        return address.save();
      })
      .then((updatedAddress) => {
        if (updatedAddress) {
          res.status(200).json({
            message: 'Address has been updated',
            result: updatedAddress,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
  
           
        
      
  
  
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


  