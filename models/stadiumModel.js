const mongoose = require("mongoose");
const nameSchema = require('./nameModel');

const SeatSchema = new mongoose.Schema({
  seatNumber: Number,
  isVacant: Boolean,
  // Add any other seat-related properties as needed
});

const RowSchema = new mongoose.Schema({
  rowNumber: Number,
  seats: [SeatSchema], // Array of seats in the row
  // Add any other row-related properties as needed
});

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [100, 'A stadium name must have no more than 100 characters'],
    minlength: [
        5,
        'A stadium name must have less or equal than 10 characters',
    ],
    default: 'Cairo Stadium',
  },
  location: {
    type: String,
    required: true,
    maxlength: [100, 'A location name must have no more than 100 characters'],
    minlength: [
        10,
        'A location name must have less or equal than 10 characters',
    ],
    default: 'Faculty of Engineering, Cairo University',
  },
  numberOfRows:{
    type: Number,
    required: [true, "A stadium must have number of rows."],
  },
  numberOfSeatsperRow:{
    type: Number,
    required: [true, "A stadium must have number of seats per row."],
  },
  rows: [RowSchema], // Array of rows in the stadium
});


// //All find querries
stadiumSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

// Pre-save middleware to generate rows and seats
stadiumSchema.pre('save', function (next) {
  if (!this.isModified('numberOfRows') && !this.isModified('numberOfSeatsPerRow')) {
    return next();
  }

  this.rows = [];
  for (let i = 1; i <= this.numberOfRows; i++) {
    let row = {
      rowNumber: i,
      seats: [],
    };
    for (let j = 1; j <= this.numberOfSeatsperRow; j++) {
      let seat = {
        seatNumber: j,
        isVacant: true,
        // Add any other seat-related properties as needed
      };
      row.seats.push(seat);
    }
    this.rows.push(row);
  }
  next();
});

const Stadium = mongoose.model("stadiumSchema", stadiumSchema);

module.exports = Stadium;
