const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/auth_config.js");


exports.getUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, config.secret);
        const userId = decodedToken.id;
    
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        console.log(token);
        console.log(user);
        res.send({ user });
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: 'Invalid or expired token' });
      }
};

exports.updateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const gender = req.body.gender;

  if (!authHeader) {
    return res.status(401).send({ message: 'Authorization header missing' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;

    let user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.name = name;
    user.surname = surname;
    user.email = email;
    user.phone_number = phone_number;
    user.gender = gender;

    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated!', detail: updatedUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
