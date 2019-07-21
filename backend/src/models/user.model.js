const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let validator = require("validator");

/**
 * Define the schema
 * the (Schema is found in mongoose)
 */
// use destructuring import to extract schema from mongoose
const { Schema } = mongoose;

// Once we have the Shema from mongoose now we can create an object
const UserSchema = Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  },
  password: { type: String, required: true },
  confirmpassword: { type: String },
  joined: { type: Date, default: new Date() }
});

//Before the user is saved encrypt the password
UserSchema.pre("save", async function(next) {
  // check if its a new account to be saved or password modified
  if (!this.isModified("password")) {
    // is password being changed?
    return next();
  }

  //encryp the password
  try {
    const salt = await bcrypt.genSalt(10); // generate salt 10
    const hashedPassword = await bcrypt.hash(this.password, salt); // then use salt value on password
    this.password = hashedPassword;
    next();
  } catch (e) {
    // in case of error?
    return next(e);
  }
});

//compare pasword with hashedpassword
UserSchema.methods.isPasswordMatch = function(
  password,
  hashedPassword,
  callback
) {
  bcrypt.compare(password, hashedPassword, (err, success) => {
    if (err) {
      return callback(err);
    }
    callback(null, success);
  }); // check password vs hashedbasspowrd
};
//compare passwords
// UserSchema.methods.comparePassword = function(password, cb){
//     bcrypt.compare(password, this.password, function(err, isMatch){})
// }
//When we login we return json without password
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password; // delete password when returnning the user object
  return userObject;
};
// our model will be the userSchema and the allias is User
const User = mongoose.model("User", UserSchema);

module.exports = User;
