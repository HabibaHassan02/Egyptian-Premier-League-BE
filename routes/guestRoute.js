const express = require("express");
const guestController = require("../controllers/guestController");

const router = express.Router();

router.route("/register").post(guestController.registerUser);

router.route("/signin").post(guestController.signin);

router.route("/checkusername").post(guestController.checkUsername);

// router.use(guestController.protect);

module.exports = router;


