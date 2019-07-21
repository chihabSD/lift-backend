/**
 * Handle the login of signup, login etc
 */
const jwt = require("jsonwebtoken"); // require the JSON web token
const User = require("../models/user.model"); //Go to models and grab the user.model
const Profile = require("../models/userProfile.model"); //Go to models and grab the user.model

const userController = {};

// Signup login
userController.register = async (req, res, next) => {
  /**
   * Creating the new user object
   * I told him that I want to create a new user object so
   * I use destructure(extracting) name, email etc from req.body
   */
  const { confirmpassword, name, email, password, joined } = req.body; // extract them from req.body
  let erros = [];
  re = /^\w+$/;
  var illegalChars = /\W/; // allow letters, numbers, and underscores

  if (!name) {
    res.send({ message: "Please enter user name" });
  } else if (name.length < 4) {
    res.send({ message: "user name is too short" });
  } else if (illegalChars.test(name)) {
    res.send({ message: "The username contains illegal characters." });
  } else if (!password) {
    res.send({ message: "Please enter your password" });
  } else if (!confirmpassword) {
    res.send({ message: "Please enter your password" });
  } else if (!email) {
    res.send({ message: "Please enter you email" });
  } else if (re.test(email)) {
    res.send({ message: "Invalid email" });
  }
  // create our new user object
  const newUser = new User({
    // the new User is from User.model
    name,
    email,
    password,
    confirmpassword,
    joined
  });

  //valdiate inputs

  //once we have create the new user object we can save him now
  try {
    /**
     * What we are saying here is to save the user  and
     * when it it save please return a user object at (const user)
     */
    const user = await newUser.save();
    return res.send({ user }); // response with the user object
  } catch (e) {
    //customization to the errer
    if (e.code === 11000 && e.name === "MongoError") {
      var error = new Error(`Email address ${newUser.email} is already taken`);
      next(error);
    } else {
      next(e); // this is comming from error handling in the file app.js which handle any error
    }
  }
};
userController.login = async (req, res, next) => {
  //user will send username and password
  const { email, password } = req.body;
  if (email === "") {
    res.send({
      message: "Please enter your email"
    });
  } else if (password === "") {
    res.send({
      message: "Please enter your password"
    });
  }
  try {
    // we check these these fields
    const user = await User.findOne({ email }); // if there a user with that email store him in user variables
    if (!user) {
      // if there is no user
      const err = new Error(`The email ${email} was not found`);
      err.status = 401;
      next(err);
    }
    /**
     * argument 1 : what has user passed thourgh reg.body
     * argument 2: the password that is found in the DB user.password
     * argument 3: the call back
     */
    user.isPasswordMatch(password, user.password, (err, matched) => {
      // if password matched
      if (matched) {
        // if password and email are okay then do JWT
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRATION;

        /**
         * argument 1: payload which is object of id (_id: user._id)
         * argument 2: secret key
         * argument 3: object of expiary date
         *
         */
        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire
        });
        return res.send({ token }); // send us back the token
        // secret
        // expiration
      }
      res.status(401).send({
        error: "Invalid username/password combination"
      });
    });
    // check if password is correct but the password is hashed so go to user.model
  } catch (e) {
    next(e);
  }
  // if they are ok then we create jwt and return it
};
userController.profile = async (req, res, next) => {
  const user = req.user;
  //extracting name, email from user
  const { name, email } = req.user;
  res.send({
    user
  });
  // display user profile object
};
userController.completeProfile = async (req, res, next) => {
  // if the user who is logged
  const user = req.user;

  const { first_name, last_name, address } = req.body; // extract them from req.body
  // create a new object
  const Profile = new Profile({});
};
userController.forgotPassword = async (req, res, next) => {
  res.send({
    message: "forgot your password? "
  });
};
module.exports = userController;
