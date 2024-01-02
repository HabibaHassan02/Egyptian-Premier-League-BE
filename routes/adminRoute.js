const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/unapproved/:id").delete(adminController.deleteUnapprovedUserById);

router.route("/:id").delete(adminController.deleteUserById);

router.route("/:id").patch(adminController.acceptPendingUserById);

router.route("/approved").get(adminController.getApprovedUsers);

router.route("/pending").get(adminController.getPendingUsers);


module.exports = router;