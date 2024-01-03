const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

router.route("/editcustomer/:id").patch(customerController.editCustomer);

router.route("/matchdetails/:id").get(customerController.viewMatch);


router.route("/reserve").post(customerController.reserveTicket);

router.route("/reserve").get(customerController.getReservations);

router.route("/cancelreservation/:id").delete(customerController.deleteReservation);

module.exports = router;
