const catchAsync = require("../utils/catchAsync");
const Match = require("../models/matchModel");

exports.getMatches = catchAsync(async (req, res, next) => {
    const matches = await Match.find().populate('matchVenue', 'name'); // 'name' is the stadium field to populate
  
    return res.status(200).json({ status: "success", data: matches });
  });