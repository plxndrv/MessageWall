const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const wall = require("./routes/api/wall");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Passport Middleware
app.use(passport.initialize());

//Use routes
app.get("/", (req, res) => {
  res.json({ msg: "Message Wall!" });
});

//Use routes
app.use("/api/users", users);
app.use("/api/wall", wall);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port " + port));
