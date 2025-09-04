const express = require("express");
const router = express.Router();
const authenicationController = require("../controller/authentication.controller");

// register route
router.post("/register", authenicationController.register);

// login route
router.post("/login", authenicationController.login);

//logout route
router.post("/logout", authenicationController.logout);

// get current user
router.get("/me", authenicationController.getCurrentUser);

// refresh token
router.post("/refresh", authenicationController.refreshToken);

module.exports = router;
