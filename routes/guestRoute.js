const express = require("express");
const guestController = require("../controllers/guestController");

const router = express.Router();

router.route("/register").post(guestController.registerUser);

router.route("/signin").post(guestController.signin);

module.exports = router;


