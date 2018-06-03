const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Require FacebookStrategy
require("../../config/facebook");

//Load User Model
const User = require("../../models/User");

//Validation
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");

//@route GET api/users/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route  GET api/users/register
//@desc   Register User
//@access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email allready exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //Rating
        d: "mm" //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route GET api/users/login
//@desc Login user/ Returning JWT Token
//@access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        //Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        //Sign Token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Incorrect input";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/users/facebook/login
//@desc Use passport.FacebookStrategy
//@access Public
router.get(
  "/facebook/login",
  passport.authenticate("facebook", {
    session: false,
    scope: ["public_profile"]
  })
);

//@route GET api/users/facebook
//@desc Login user with facebook/ Returning JWT Token
//@access Public
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { session: false }),
  (err, user, info) => {
    console.log(err, user);
  }
);

//@route  GET api/users/current
//@desc   Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  }
);

//@route  GET api/users/google/login
//@desc   Login with Google+
//@access Public
router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//@route  GET api/users/google/login
//@desc   Login with Google+
//@access Public
router.get(
  "/google/callback",
  passport.authenticate("google", (err, user) => {
    console.log("user ", user);
    //Create JWT payload
    const payload = {
      id: user._id,
      name: user.name,
      avatar: user.avatar
    };
    //Sign Token
    jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
      console.log("Bearer " + token);
      res.json({
        success: true,
        token: "Bearer " + token
      });
    });

    // //Create JWT payload
    // const payload = {
    //   id: user.id,
    //   name: user.name,
    //   avatar: user.avatar
    // };
    // //Sign Token
    // jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
    //   res.json({
    //     success: true,
    //     token: "Bearer " + token
    //   });
    // });
  })
);

module.exports = router;
