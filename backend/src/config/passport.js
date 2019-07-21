const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user.model");

//funciton by default
// export to to use in app.js as (require("./config/passport")(passport);)
module.exports = passport => {
  //config jwt secret key and auth header
  let config = {};
  config.secretOrKey = process.env.JWT_SECRET;
  config.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // tell him that jwt is found at the authheader.
  /**
   * use passport
   * tell passport that we want new jwtStrategy
   * the jwtStrategy takes in the config from above as a callback in first argument
   * and the return callback of jwtPayload
   * the payload is te _id: user_id from users.controllers
   */
  passport.use(
    new JwtStrategy(config, async (jwtPayload, done) => {
      try {
        console.log(jwtPayload);
        // return user id
        const user = await User.findById(jwtPayload._id);
        if (user) {
          // if there is a user
          return done(null, user); // return done
        } else {
          return done(null, false); // we dont have error but we dont have user either so return false
        }
      } catch (e) {
        return done(err, false);
      }
    })
  );
};
