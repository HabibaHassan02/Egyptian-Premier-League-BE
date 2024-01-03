const mongoose = require('mongoose');
const validator = require('validator');
const nameSchema = require('./nameModel');

const seatSchema = new mongoose.Schema({
    row: {
        type: Number,
        required: [true, "A row number must exist in a seat."],
    },
    seats: [{
        type: Number,
        required: [true, "A seat number must exist in a row."],
    }],
});

const ticketSchema = new mongoose.Schema({
        seatnumber: {
        type: [seatSchema],
        required: [true, "A seat number must exist in ticket."],
        },
        match: {
            type:mongoose.Schema.ObjectId,
            ref:'Match',
            required: [true, "A ticket must be attached to a match."],
        },
        buyer: {
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required: [true, "A ticket must be attached to a buyer."],
        },
});

  // //All find querries
ticketSchema.pre(/^find/, function (next) {
    this.select({
        __v: 0,
    });
    next();
});
const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
