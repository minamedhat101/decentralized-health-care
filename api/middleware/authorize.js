const jwt = require('jsonwebtoken');
const config = require('../config/database');
const UserType = require('../models/userType');

module.exports = (roles = []) => {
  return async (req, res, next) => {
    try {
      console.log(roles)
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.secret);
      let type = await UserType.findOne({ _id: decoded.data.userType }).exec();
      console.log(type.name)
      let flag = false;
      console.log('before the for')
      for (const role of roles) {
        console.log(role);
        if (type.name == role) {
          console.log('inside if')
          req.userData = decoded;
          flag = true;
          break;
        }
        console.log('number')
      }
      if (!flag) {
        res.status(401).json({
          message: 'Not Authorized'
        });

      } else {
        next();
      }
    } catch (error) {
      return res.status(401).json({
        message: 'Not Authorized'
      });
    }
  };
};