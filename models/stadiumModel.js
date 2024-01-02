const mongoose = require("mongoose");
const nameSchema = require('./nameModel');

const stadiumSchema = new mongoose.Schema({
  name: nameSchema,
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
  numberOfVacantSeats:{
    type: Number,
    default: function() {
      return this.numberOfRows * this.numberOfSeatsperRow;
    }
  },
  numberOfReservedSeats:{
    type: Number,
    default: 0,
  },
});


// //All find querries
stadiumSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

const Stadium = mongoose.model("stadiumSchema", stadiumSchema);

module.exports = Stadium;
