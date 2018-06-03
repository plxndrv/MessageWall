const gravatar = require("gravatar");
const GoogleStrategy = require("passport-google-oauth20");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            console.log(user);
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.google.client_id,
        clientSecret: keys.google.client_secret,
        callbackURL: "/api/users/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile.emails[0].value, profile.displayName);
        User.findOne({ email: profile.emails[0].value })
          .then(existingUser => {
            if (existingUser) {
              done(null, existingUser);
            } else {
              const avatar = gravatar.url(profile.emails[0].value, {
                s: "200", //size
                r: "pg", //Rating
                d: "mm" //Default
              });
              new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar
              })
                .save()
                .then(user => done(null, user))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      }
    )
  );
};
