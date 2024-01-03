const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//creates token and attaches it to cookie.
exports.createToken = (user, res) => {
  const token = signToken(user._id);
  res.token = token;
};

//creates token and sends it as a standard responsee
exports.createSendToken = (user, statusCode, res) => {
  exports.createToken(user, res);
  console.log("hiiiii");
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token: res.token,
    data: user,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  console.log("entered protection");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.body.token) token = req.body.token;
  if (req.headers.token) token = req.headers.token;

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
});

exports.registerUser = catchAsync(async (req, res, next) => {
  const createdUser = await User.create(req.body).catch((err) =>
    //Send error response if any error is encountered
    res.status(400).json({
      status: "failed",
      message: err.message,
    })
  );
//   const confirmToken = await crypto.randomBytes(32).toString("hex");

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(confirmToken)
//     .digest("hex");

//   createdUser.token = hashedToken;
//   createdUser.tokenExpiry = Date.now() + 60 * 60 * 1000; //1 hour

//   await createdUser.save();

//   exports.createSendToken(createdUser, 200, res);

    if (res.headersSent) return;
    return res.status(200).json({
      status: "success",
      data: createdUser,
    });
});

exports.checkUsername = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(200).json({
        status: "fail",
        message: "Username already exists",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Username is available",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

exports.signin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username }).select(
    "+password"
  );
//   console.log(user);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  const isCorrectPassword = await user.correctPassword(
    req.body.password,
    user.password
  );
  if (!isCorrectPassword) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect password",
    });
  }

//   const confirmToken = await crypto.randomBytes(32).toString("hex");

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(confirmToken)
//     .digest("hex");

//     user.token = hashedToken;
//     user.tokenExpiry = Date.now() + 60 * 60 * 1000; //1 hour

//   await user.save();

//   exports.createSendToken(user, 200, res);

    res.status(200).json({
      status: "success",
      data: user,
    });
});
