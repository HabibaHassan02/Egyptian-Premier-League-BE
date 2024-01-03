const catchAsync = require("../utils/catchAsync");
const Match = require("../models/matchModel");
const Stadium = require("../models/stadiumModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Ticket = require("../models/ticketModel");

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
    "address"
  );
  const updatedUser = await User.findById(req.params.id);
  if (!updatedUser) {
    return res.status(404).json({
      status: "fail",
      message: "No user found with this id ",
    });
  }
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
      status: "fail",
      message: "No such match found with id",
    });
  }
  return res.status(200).json({
    status: "success",
    data: match,
  });
});

exports.reserveTicket = catchAsync(async (req, res, next) => {
  let matchID = req.body.match;
  let buyerID = req.body.buyer;
  let seats = req.body.seats;
  let indicator = false;
  let twoHours = 1000 * 3600 * 2;
  let match = await Match.findById(matchID);
  if (!match) {
    return res.status(404).json({
      status: "fail",
      message: "No match found with this id ",
    });
  }
  let matchDate = match.dateandtime;
  let userTickets = await Ticket.find({ buyer: buyerID }).select("match");
  for (const element of userTickets) {
    let reservedMatch = await Match.findById(element.match);
    if (reservedMatch._id == match._id) continue;
    let reservedDate = reservedMatch.dateandtime;
    if (Math.abs(reservedDate - matchDate) < twoHours) {
      indicator = true;
      break;
    }
  }
  if (indicator) {
    return res.status(400).json({
      success: "false",
      error: "This reservation clashes with previous reservation",
    });
  }
  let stadiumID = match.matchVenue;
  let stadium = await Stadium.findById(stadiumID);
  if (!stadium) {
    console.log("No stadium found with that ID");
    return;
  }
  // let numberOfTicketswanted=0;
  let toBeReserved = {};
  for (const rowNumber of Object.keys(seats)) {
    let row = stadium.rows.find((row) => row.rowNumber === Number(rowNumber));
    if (!row) {
      console.log(`No row found with number ${rowNumber}`);
      continue;
    }
    if (!toBeReserved[rowNumber]) {
      toBeReserved[rowNumber] = [];
    }
    for (const seatNumber of seats[rowNumber]) {
      let seat = row.seats.find((seat) => seat.seatNumber === seatNumber);
      if (!seat) {
        console.log(
          `No seat found with number ${seatNumber} in row ${rowNumber}`
        );
        continue;
      }
      if (!seat.isVacant) {
        return res.status(400).json({
          success: "false",
          error: `Seat ${seatNumber} in row ${rowNumber} is already reserved`,
        });
        // console.log(`Seat ${seatNumber} in row ${rowNumber} is already reserved`);
        // continue;
      }
      seat.isVacant = false;
      let stadiumSeat = stadium.rows
        .find((row) => row.rowNumber === Number(rowNumber))
        .seats.find((seat) => seat.seatNumber === seatNumber);
      stadiumSeat.isVacant = seat.isVacant;

      toBeReserved[rowNumber].push(seatNumber);
    }
  }
  let counter = 0;
  for (const key of Object.keys(toBeReserved)) {
    if (toBeReserved[key].length === 0) {
      counter++;
    }
  }
  if (counter == Object.keys(toBeReserved).length) {
    return res.status(400).json({
      success: "false",
      error: "seats are already booked",
    });
  } else {
    const seatmapped = Object.keys(toBeReserved).map((rowNumber) => ({
      row: Number(rowNumber),
      seats: toBeReserved[rowNumber],
    }));
    let newTicket = await Ticket.create({
      match: matchID,
      buyer: buyerID,
    });
    newTicket.seatnumber = seatmapped;

    await newTicket.save();

    await stadium.save();
    res.status(200).json({
      success: "true",
    });
  }
});

exports.getReservations = catchAsync(async (req, res, next) => {
  const userId = req.body.buyer;

  const reservations = await Ticket.find({ buyer: userId });

  if (reservations.length===0) {
    return res
      .status(404)
      .json({
        status: "fail",
        message: "No user with this id has a reservation ",
      });
  }

  return res.status(200).json({ status: "success", data: reservations });
});
