// routes/users.js
const express = require("express");
const usersController = require("../controllers/usersController");
const passport = require("passport");
const { check } = require("express-validator"); // Add validation
require("../passport");

const router = express.Router(); // Create the router object

// Route to register a new user (no authentication required)
/**
 * Route for registering a new user. Includes validation middleware.
 * @name POST /users
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Express-validator middleware for input validation.
 * @param {callback} middleware - {@link module:controllers/usersController.registerUser}
 */
router.post(
  "/",
  [
    check(
      "username",
      "Username is required and must be at least 5 characters long"
    ).isLength({ min: 5 }),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email must be valid").isEmail(),
  ],
  usersController.registerUser
);

// All other routes are protected
/**
 * Route for updating user information. Includes JWT authentication and validation middleware.
 * @name PUT /users/:username
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - Express-validator middleware for input validation.
 * @param {callback} middleware - {@link module:controllers/usersController.updateUserInfo}
 */
router.put(
  "/:username",
  [
    passport.authenticate("jwt", { session: false }),
    check("username", "Username must be at least 5 characters long")
      .optional()
      .isLength({ min: 5 }),
    check("email", "Email must be valid").optional().isEmail(),
  ],
  usersController.updateUserInfo
);

/**
 * Route for adding a movie to a user's favorites. Includes JWT authentication.
 * @name POST /users/:username/movies/:movieID
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/usersController.addMovieToFavorites}
 */
router.post(
  "/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  usersController.addMovieToFavorites
);

/**
 * Route for removing a movie from a user's favorites. Includes JWT authentication.
 * @name DELETE /users/:username/movies/:movieID
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/usersController.removeMovieFromFavorites}
 */
router.delete(
  "/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  usersController.removeMovieFromFavorites
);

/**
 * Route for deleting a user account. Includes JWT authentication.
 * @name DELETE /users/:username
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/usersController.deleteUser}
 */
router.delete(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  usersController.deleteUser
);

// Add a series to user's favorites
/**
 * Route for adding a series to a user's favorites. Includes JWT authentication.
 * @name POST /users/:username/series/:seriesID
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/usersController.addSeriesToFavorites}
 */
router.post(
  "/:username/series/:seriesID",
  passport.authenticate("jwt", { session: false }),
  usersController.addSeriesToFavorites
);

// Remove a series from user's favorites
/**
 * Route for removing a series from a user's favorites. Includes JWT authentication.
 * @name DELETE /users/:username/series/:seriesID
 * @function
 * @memberof module:routes/users
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/usersController.removeSeriesFromFavorites}
 */
router.delete(
  "/:username/series/:seriesID",
  passport.authenticate("jwt", { session: false }),
  usersController.removeSeriesFromFavorites
);

module.exports = router;
