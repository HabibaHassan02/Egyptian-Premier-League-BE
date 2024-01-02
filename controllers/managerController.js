const catchAsync  = require('../utils/catchAsync');
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
    data: {
      event: createdMatch,
    },
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
  const { name, location, numberOfRows, numberOfSeatsperRow, numberOfVacantSeats, numberOfReservedSeats } =
    req.body;
  const createdStadium = await Stadium.create({
    name, 
    location,
    numberOfRows,
    numberOfSeatsperRow, 
    numberOfVacantSeats, 
    numberOfReservedSeats
  }).catch((err) =>
    //Send error response if any error is encountered
    res.status(400).json({
      status: "failed",
      message: err.message,
    })
  );
  //if an error happned while creating the stadium
  if (res.headersSent) return;
  return res.status(200).json({
    status: "success",
    data: {
      event: createdStadium,
    },
  });
});

exports.getMatch = catchAsync(async (req, res, next) => {
  
    const match = await Match.findOne({ _id: req.params.id });
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

  exports.getMatchVacantSeats = catchAsync(async (req, res, next) => {
  
    const match = await Match.findOne({
      _id: req.params.id,
    });
    if (!match){
        return res.status(404).json({
          status: 'fail',
          message: 'Invalid match id',
        });
      }
    const stadiumID = match.matchVenue
    const stadium = await Stadium.findOne({
        _id: stadiumID,
      });
    return res.status(200).json({
        status: 'success',
        data: stadium.numberOfVacantSeats
      });
  });


  exports.getMatchResrevedSeats = catchAsync(async (req, res, next) => {
  
    const match = await Match.findOne({
      _id: req.params.id,
    });
    if (!match){
        return res.status(404).json({
          status: 'fail',
          message: 'Invalid match id',
        });
      }
    const stadiumID = match.matchVenue
    const stadium = await Stadium.findOne({
        _id: stadiumID,
      });
    return res.status(200).json({
        status: 'success',
        data: stadium.numberOfReservedSeats
      });
  });