const Address = require('../models/address');
const Event = require('../models/event');
const Location = require('../models/location');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');
const sequelize = require('../util/database');
exports.createAddress = (req, res, next) => {
    const country = req.body.country;
    const event_id = req.body.event_id;
    const district = req.body.district;
    const province = req.body.province;
    const locationName = req.body.locationName;
    const forDirection = req.body.forDirection;
    const subLocality = req.body.subLocality;

    if (!country || !event_id || !district || !province || !locationName || !subLocality) {
        const error = new Error('All fields are required');
        error.statusCode = 404;
        throw error;
    }

    if (event_id == null) {
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

exports.findClosestCitiesAndStreets = async (req, res, next) => {
        const lattiude = req.body.lattiude;
        const longitude = req.body.longitude;
        const limit = req.body.limit?? 5;

        const events = await Event.findAll({
            include: [
            {
                model: Location 
            },
            {
                model: Address
            }
        ]});

        console.log("before loop");
        events.forEach(event => {
            console.log("in loop");
            const difference = Math.sqrt(Math.pow(event.location.lattiude - lattiude, 2) + Math.pow(event.location.longitude - longitude, 2));
            event.distanceDifference = difference;
            console.log(difference);
        });

        console.log("after loop");

        events.sort((a, b) => {
            return a.dataValues.distanceDifference - b.dataValues.distanceDifference;
        });

        sortedEventsCities = events.map((x) => ({'province': x.address.province, 'district': x.address.district}));
        

        let counter = 0;
        const result = [];

        for(let i = 0; i < sortedEventsCities.length; i++){
            if (!result.includes(sortedEventsCities[i].district)){
                if(!result.includes(sortedEventsCities[i].province)){
                    result.push(sortedEventsCities[i].province);
                    counter++;
                }
                result.push(sortedEventsCities[i].district);
                counter++;
            }
            if (counter > limit) {
                break;
            }
        }


        // locations.forEach(location => {
        //     const difference = Math.sqrt(Math.pow(location.lattiude - lattiude, 2) - Math.pow(location.longitude - longitude, 2));
            
        // });

        // find 5 events id that are closest to the user
        // let events = [];

        // const locations = await sequelize.query(
        //     `SELECT id, lattiude, longitude
        //       FROM locations where lattiude between ${lattiude-radius} and ${lattiude+ radius} and ${longitude-radius} and ${longitude+ radius} LIMIT ${limit}`,
        //     { type: QueryTypes.SELECT }
        // );

        // for (let i = 0; i < locations.length; i++) {
        //     const location = locations[i];
        //     const locationId = location.id;
        //     const event = await Event.findOne({ where: { location_id: locationId } });
        //     events.push(event);
        // }

        // if (events.length == 0) {
        //     return res.status(400).json({message: 'There is no event address for fetching'})
        // }
        
        // const result = await sequelize.query(
        //     `SELECT DISTINCT province, district FROM addresses WHERE event_id IN (${events.map(event => event.id)})`,
        //     { type: QueryTypes.SELECT }
        // );
        
        // return res.status(200).json({ message: 'Fetched locations.', result: result });
 
    }