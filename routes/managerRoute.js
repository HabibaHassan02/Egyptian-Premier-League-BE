const express = require("express");
const managerController = require("../controllers/managerController");

const router = express.Router();

router.route("/match/:id").get(managerController.getMatch);

router.route("/vacant/:id").get(managerController.getMatchVacantSeats);

router.route("/reserved/:id").get(managerController.getMatchResrevedSeats);

router.route("/match").post(managerController.createMatch);

router.route("/stadium").post(managerController.createStadium);

router.route("/match/:id").patch(managerController.editMatch);


module.exports = router;
