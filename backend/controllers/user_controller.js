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