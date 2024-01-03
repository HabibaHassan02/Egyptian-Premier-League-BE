
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const Match = require("../models/matchModel");
const Stadium = require("../models/stadiumModel");
const User = require("../models/userModel")
const AppError = require('../utils/appError');

exports.registerUser = catchAsync(async (req, res, next) => {
    
    const createdUser = await User.create(req.body).catch((err) =>
      //Send error response if any error is encountered
    res.status(400).json({
        status: "failed",
        message: err.message,
    })
    );
    //if an error happened while registering user
    if (res.headersSent) return;
    return res.status(200).json({
        status: "success",
        data: {
        event: createdUser,
    },
    });
});

exports.checkUsername = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
        res.status(200).json({
            status: 'fail',
            message: 'Username already exists'
        });
        } else {
            res.status(200).json({
            status: 'success',
            message: 'Username is available'
        });
        }
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
});

exports.signin = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username }).select('+password');
    console.log(user)
    if (!user) {
        return res.status(404).json({
        status: 'fail',
        message: 'User not found'
    });
    }
    const isCorrectPassword = await user.correctPassword(req.body.password,user.password);
    if (!isCorrectPassword) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect password'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    }); 
});