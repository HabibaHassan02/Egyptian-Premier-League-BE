const catchAsync  = require('../utils/catchAsync');
const Match = require("../models/matchModel");
const Stadium = require("../models/stadiumModel");
const User = require("../models/userModel")
const AppError = require('../utils/appError');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
exports.editCustomer = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(
        req.body,
        "password",
        "name",
        "gender",
        "city",
        "address",
    );
    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) {
        return res.status(404).json({
        status: "fail",
        message: "No user found with this id ",
    })};
    updatedUser.set(filteredBody);
    updatedUser.name.firstName = req.body.name.firstName;
    updatedUser.name.lastName = req.body.name.lastName;
    updatedUser.role = req.body.role;
    try {
        await updatedUser.save();
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
    return res.status(200).json({
        status: "success",
        data: updatedUser,
    });

});

exports.viewMatch = catchAsync(async (req, res, next) => {
    const match = await Match.findById(req.params.id);
    if (!match) {
        return res.status(404).json({
        status: 'fail',
        message: 'No such match found with id',
    });
    }
    return res.status(200).json({
        status: 'success',
        data: match,
    });
});

exports.reserveTicket = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(
        req.body,
        "password",
        "name",
        "gender",
        "city",
        "address",
    );
    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) {
        return res.status(404).json({
        status: "fail",
        message: "No user found with this id ",
    })};
    updatedUser.set(filteredBody);
    updatedUser.name.firstName = req.body.name.firstName;
    updatedUser.name.lastName = req.body.name.lastName;
    updatedUser.role = req.body.role;
    try {
        await updatedUser.save();
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
    return res.status(200).json({
        status: "success",
        data: updatedUser,
    });

});