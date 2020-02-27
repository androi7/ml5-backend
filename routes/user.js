const express = require("express");
// https://github.com/validatorjs/validator.js#validators
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const router = express.Router();

const models = require("../models/User");
const User = models.user;
// const User = require("../model/User");

// jsdoc
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 * <br> - username validation: must exist
 * <br> - email validation: min 6 chars, min 1 uppercase letter, min 1 number
*/

/*
  // function must include next, otherwise middleware chain is stopped
  const fcn1 = function (req, res, next) {
    ...
    next();
  }
  app.use('/', [fcn1, fcn2, fcn3], (req, res) => {
    ...
  });
*/
router.post(
  "/signup",
  [
    check("username", "Please enter a valid username")
      .not()  // negates result of next validator
      .isEmpty(),
    check("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail(),
    check("password", "Please enter a valid password")
      .isLength({
        min: 6
      }).withMessage('must be at least 6 chars long').matches(/\d/).withMessage('must contain a number').matches(/[A-Z]/).withMessage('must contain an uppercase letter'),
    check("passwordConfirmation", "passwords don't match")
      .exists()
      .custom((value, { req }) => value === req.body.password)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log('errors', errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        // 400: bad request
        return res.status(400).json({
          msg: "User already exists"
        });
      }

      user = new User({
        username,
        email,
        password
      });


      //const salt = await bcrypt.genSalt(10);
      // rounds: The cost of processing the data. The module will use the value you enter and go through 2^rounds iterations of processing.
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds)

      await user.save((err) => {
        if (err) return console.error(err);
      });

      const payload = {
        user: {
          id: user.id,
          username: user.username
        }
      };

      jwt.sign(
        payload,
        "myPrivateKey", {
          // algorith: HS256, // default
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          // 200 OK
          res.status(200).json({ token });
        }
      ); // jwt.sign()

    } catch(err) {
      console.log(err.message);
      // 500 Internal Server Error
      res.status(500).send("Error in saving");
    }  // try/catch
  } // async cb(req, res)
); // router.post()


/**
 * @method - POST
 * @param - /login
 * @description - User Login
*/

router.post(
  "/login",
  [
    check("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail(),
    check("password", "Please enter a valid password")
      .isLength({
        min: 6
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "User not exist"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password!"
        });
      }

      const payload = {
        user: {
          id: user.id,
          username: user.username
        }
      };

      jwt.sign(
        payload,
        "myPrivateKey",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            username: user.username,
            email: user.email,
            id: user._id
          });
        }
      ); // jwt.sign()
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server error"
      });
    } // try/catch
  } // async cb()
); // router.post()


/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
*/

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch(e) {
    res.send({
      message: "Error in fetching user"
    });
  }  // try/catch
}); // router.get()

module.exports = router;
