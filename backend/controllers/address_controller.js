const Address = require('../models/address');
const Sequelize = require('sequelize');

exports.createAddress = (req, res, next) => {
    const country = req.body.country;
    const city= req.body.city;
    const state = req.body.state;
    const street = req.body.street;
    const postcode = req.body.postcode;
    const event_id = req.body.event_id;

    Address.create({
        country: country,
        city:city,
        state: state,
        street: street,
        postcode: postcode,
        event_id: event_id
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
exports.getAddress = (req, res, next) => {
    const addressId = req.params.id;
    Group.findByPk(addressId)
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

  