const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const nameSchema = require('./nameModel');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "A user must have a username."],
        unique: true,
        maxlength: [40, "A username must be at most 40 characters"],
        minlength: [5, "A usrername must be at least 5 character"],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Minimum length for password is 8'],
        select: false, //prevents passwords from being selected while querrying users
    },
    name: nameSchema,
    birthdate:{
        type: Date,
        default: Date.now(),
        required: [true, 'Please provide your birth date'],
        validate: [
            {
            validator: validator.isDate,
            message: 'Date must be in the right date format.',
            },
            {
            validator: function (value) {
                return new Date(value) < new Date();
            },
            message: 'Date must be in the past',
            },
        ],
    },
    gender:{
        type: String,
        required: [true, "A user must have a gender type."],
    },
    city:{
        type: String,
        required: [true, "A user must have a city."],
        maxlength: [40, "A city name must be at most 40 characters"],
        minlength: [1, "A city name must be at least 1 character"],
    },
    address:{
        type: String,
        required: [false],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role:{
        type: String,
        required: [true, "A user must have a role."],
        maxlength: [7, "A role type must be at most 7 characters"], //at most 7 for manager
        minlength: [3, "A city name must be at least 3 character"], //at least 3 for fan
    },
    //used for JWT auth
    passwordChangedAt: {
        type: Date,
        validate: [validator.isDate, 'Must be right date format.'],
        required: [true, 'Last Changed at is required'],
        default: Date.now(),
    },
});

//All find querries
userSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
    'location.type': 0,
    'location._id': 0,
    'name._id': 0,
  });
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now();
  next();
});

//for checking passwords against each other
// A function that compares a given password with the password in in the Database.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
