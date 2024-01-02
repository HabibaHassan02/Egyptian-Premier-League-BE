const mongoose = require("mongoose");
const validator = require("validator");
const Stadium = require('./stadiumModel')

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    required: [true, "A match must have a home team."],
    maxlength: [40, "A home team name must be at most 40 characters"],
    minlength: [1, "A home team name must be at least 1 character"],
  },
  awayTeam: {
    type: String,
    required: [true, "A match must have an away team."],
    maxlength: [40, "An away team name must be at most 40 characters"],
    minlength: [1, "An away team name must be at least 1 character"],
  },
  matchVenue:{  //stadium ID
    type: mongoose.Schema.ObjectId,
    ref: 'Stadium',
    required: [true, 'The match  must belong to a stadium'],
  },
  dateandtime: {
    type: Date,
    default: Date.now(),
    required: [true, 'Please provide a date for the match'],
    validate: [
        {
        validator: validator.isDate,
        message: 'Date must be in the right date format.',
        },
        {
        validator: function (value) {
            return new Date(value) > new Date();
        },
        message: 'Date must be in the future',
        },
    ],
  },
  mainReferee:{
    type: String,
    required: [true, "A match must have a referee."],
    maxlength: [40, "A referee name must be at most 40 characters"],
    minlength: [1, "A referee name must be at least 1 character"],
  },
  linesmen: {
    type: [String],
    default: [],
    validator: function (array) {
      return array.every(
        (v) => typeof v === "string" && v.length > 0 && v.length < 80
      );
    },
    validator: function (array) {
        return array.length()==2;
    }
  },
});

//matchSchema.index({ name: 1, category: 1 }, { unique: true });

// //All find querries
matchSchema.pre(/^find/, function (next) {
  this.select({
    __v: 0,
  });
  next();
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
