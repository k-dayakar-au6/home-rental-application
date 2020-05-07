var User = require("../model/user");

module.exports = function(req, res, next) {
  if (!req.session.userId) return res.status(404).json({message:"login again"})

    User.findById(req.session.userId)
      .then(function(user) {
        req.user = user;
        next();
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }
