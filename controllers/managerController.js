const catchAsync = require("../utils/catchAsync");
const Match = require("../models/matchModel");
const Stadium = require("../models/stadiumModel");

exports.createMatch = catchAsync(async (req, res, next) => {
  console.log("reached create match route");
  const { homeTeam, awayTeam, matchVenue, dateandtime, mainReferee, linesmen } =
    req.body;
  const createdMatch = await Match.create({
    homeTeam,
    awayTeam,
    matchVenue,
    dateandtime,
    mainReferee,
    linesmen,
  }).catch((err) =>
    //Send error response if any error is encountered
    res.status(400).json({
      status: "failed",
      message: err.message,
    })
  );
  //if an error happned while creating the match
  if (res.headersSent) return;
  return res.status(200).json({
    status: "success",
    data: createdMatch,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.editMatch = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "homeTeam",
    "awayTeam",
    "matchVenue",
    "dateandtime",
    "mainReferee",
    "linesmen"
  );
  console.log("filtered body", filteredBody);
  const updatedMatch = await Match.findById(req.params.id);
  if (!updatedMatch) {
    return res.status(404).json({
      status: "fail",
      message: "No Match found with this id ",
    });
  }

  updatedMatch.set(filteredBody);
  await updatedMatch.save();

  // updatedMatch._id = undefined;
  return res.status(200).json({
    status: "success",
    data: updatedMatch,
  });
});

exports.createStadium = catchAsync(async (req, res, next) => {
  console.log("reached create Stadium route");
  const { name, location, numberOfRows, numberOfSeatsperRow } = req.body;
  const createdStadium = await Stadium.create({
    name,
    location,
    numberOfRows,
    numberOfSeatsperRow,
  }).catch((err) =>
    //Send error response if any error is encountered
    res.status(400).json({
      status: "failed",
      message: err.message,
    })
  );
  //if an error happned while creating the stadium
  return res.status(200).json({
    status: "success",
    data: createdStadium,
  });
});

exports.getMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findOne({ _id: req.params.id });
  if (!match) {
    return res.status(404).json({
      status: "fail",
      message: "No such match found with id",
    });
  }
  return res.status(200).json({
    status: "success",
    data: match,
  });
});

exports.getMatchVacantSeats = catchAsync(async (req, res, next) => {
  const match = await Match.findOne({
    _id: req.params.id,
  });
  if (!match) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid match id",
    });
  }
  const stadiumID = match.matchVenue._id;
  const stadium = await Stadium.findOne({
    _id: stadiumID,
  });

  const vacantSeatsDetails = [];

  stadium.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      if (seat.isVacant) {
        vacantSeatsDetails.push({
          rowNumber: row.rowNumber,
          seatNumber: seat.seatNumber,
        });
      }
    });
  });

  return res.status(200).json({ status: "success", data: vacantSeatsDetails });
});

exports.getMatchResrevedSeats = catchAsync(async (req, res, next) => {
  const match = await Match.findOne({
    _id: req.params.id,
  });
  if (!match) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid match id",
    });
  }
  const stadiumID = match.matchVenue;
  const stadium = await Stadium.findOne({
    _id: stadiumID,
  });

  const reservedSeatsDetails = [];

  stadium.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      if (!seat.isVacant) {
        reservedSeatsDetails.push({
          rowNumber: row.rowNumber,
          seatNumber: seat.seatNumber,
        });
      }
    });
  });

  return res
    .status(200)
    .json({ status: "success", data: reservedSeatsDetails });
});

exports.getStadiumDimensionOfMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findOne({
    _id: req.params.id,
  });
  if (!match) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid match id",
    });
  }
  const stadiumID = match.matchVenue;
  const stadium = await Stadium.findOne({
    _id: stadiumID,
  });
  const rows = stadium.numberOfRows;
  const seats = stadium.numberOfSeatsperRow;
  return res
    .status(200)
    .json({ status: "success", data: { numRows: rows, seatsPerRow: seats } });
});

exports.getStadiums = catchAsync(async (req, res, next) => {
  const stadiums = await Stadium.find({},'name');

  return res.status(200).json({ status: "success", data: stadiums });
});
