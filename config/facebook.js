const passport = require("passport");
const passportFacebook = require("passport-facebook");
const User = require("../models/User");

const passportConfig = {
  clientID: "2528992237326470",
  clientSecret: "82f9b2b4e68df3e140d211cee9c2c239",
  callbackURL: "http://localhost:5000/api/users/facebook/redirect",
  profileFields: ["id", "displayName", "name", "gender", "picture.type(large)"]
};

if (passportConfig.clientID) {
  passport.use(
    new passportFacebook.Strategy(passportConfig, function(
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      User.findOne({ provider: "facebook", uid: profile.id }).then(user => {
        console.log("\n\n\nuser::", profile.photos[0].value);
        try {
          if (!user) {
            console.log("user does not exists", user);
            User.create({
              name: profile.displayName,
              provider: "facebook",
              uid: profile.id
              // photoUrl: profile.photos[0]
            })
              .then(user => {
                return done(null, user);
                console.log("eita exec hoy nken!!user");
              })
              .catch(e => {
                return done(e, user);
                console.log("eita exec hoy nken!!user");
              });
          } else {
            console.log("user already exists", user);
            return done(null, user);
            console.log(user);
          }
        } catch (error) {
          console.log(error);
        }
      });
    })
  );
}
