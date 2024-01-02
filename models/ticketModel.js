const mongoose = require('mongoose');
const validator = require('validator');
const nameSchema = require('./nameModel');
const ticketSchema = new mongoose.Schema({
        seatnumber: {
        type: Number,
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
