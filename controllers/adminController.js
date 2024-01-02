const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.deleteUnapprovedUserById = catchAsync(async (req, res, next) => {
  //   const  userId  = req.params.id; // Assuming the ID is passed in the request params
  //   const user = await User.findOne({
  //     _id: userId,
  //   });

  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ status: "fail", message: " user not found" });
  //   }

  //   if (user.isApproved == true){
  //     return res
  //       .status(404)
  //       .json({ status: "fail", message: " Sorry! user already approved." });
  //   }

  //   const deletedUser = await User.findOneAndDelete({
  //     _id: userId,
  //   });

  //   return res.status(200).json({
  //     status: "success",
  //     message: "User deleted successfully",
  //     data: deletedUser,
  //   });
  const  userId  = req.params.id;
  const userToDelete = await User.findOne({ _id: userId, isApproved: false });

  if (!userToDelete) {
    return res.status(404).json({
      status: "fail",
      message: "Unapproved user not found or already approved",
    });
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  return res.status(200).json({
    status: "success",
    message: "Unapproved user deleted successfully",
    data: deletedUser,
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const deletedUser = await User.findOneAndDelete({ _id: userId });

  if (!deletedUser) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  return res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: deletedUser,
  });
});

exports.acceptPendingUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id; // Assuming the ID is passed in the request params
  const user = await User.findOneAndUpdate(
    { _id: userId, isApproved: false },
    { isApproved: true },
    { new: true }
  );

  if (!user) {
    return res
      .status(404)
      .json({ status: "fail", message: "Pending user not found" });
  }

  return res.status(200).json({
    status: "success",
    message: "User accepted successfully",
    data: user,
  });
});

exports.getApprovedUsers = catchAsync(async (req, res, next) => {
  const approvedUsers = await User.find({ isApproved: true });

  return res.status(200).json({ status: "success", data: approvedUsers });
});

exports.getPendingUsers = catchAsync(async (req, res, next) => {
  const pendingUsers = await User.find({ isApproved: false });

  return res.status(200).json({ status: "success", data: pendingUsers });
});
