const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Message Model
const Message = require("../../models/Message");

//Validation
const validateMessageInput = require("../../validation/message");

//@route GET api/wall/test
//@desc Test wall route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Wall Works" }));

//@route GET api/wall
//@desc Get Message
//@access Public
router.get("/", (req, res) => {
  Message.find()
    .sort({ date: -1 })
    .then(messages => res.json(messages))
    .catch(err => res.status(404).json({ nomessage: "No messages found" }));
});

//@route GET api/wall/:id
//@desc Get message by id
//@access Public
router.get("/:id", (req, res) => {
  Message.findById(req.params.id)
    .then(message => res.json(message))
    .catch(err =>
      res.status(404).json({ nomessagefound: "No message found with that ID" })
    );
});

//@route POST api/wall
//@desc Create Message
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);
    //Check validation
    if (!isValid) {
      //Send 400 if any errors
      return res.status(400).json(errors);
    }

    const newMessage = new Message({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newMessage.save().then(message => res.json(message));
  }
);

//@route DELETE api/wall/:id
//@desc Delete message by id
//@access Public
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Message.findById(req.params.id)
      .then(msg => {
        //Check for owner
        if (msg.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        //Delete
        msg.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ msgnotfound: "Message not found" }));
  }
);

//@route POST api/wall/comment/:id
//@desc Add Comment
//@access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);
    //Check validation
    if (!isValid) {
      //Send 400 if any errors
      return res.status(400).json(errors);
    }

    Message.findById(req.params.id)
      .then(msg => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        msg.comments.unshift(newComment);

        //Save
        msg.save().then(msg => res.json(msg));
      })
      .catch(err => res.status(404).json({ msgnotfound: "Message not found" }));
  }
);

//@route DELETE api/wall/comment/:id/comment_id
//@desc Remove Comment from msg
//@access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);
    //Check validation
    if (!isValid) {
      //Send 400 if any errors
      return res.status(400).json(errors);
    }

    Message.findById(req.params.id)
      .then(msg => {
        //Check if comments exists
        if (
          msg.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        //Get remove index
        const removeIndex = msg.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //Splice comnt from array
        msg.comments.splice(removeIndex, 1);

        //Save
        msg.save().then(msg => res.json(msg));
      })
      .catch(err => res.status(404).json({ msgnotfound: "Message not found" }));
  }
);

module.exports = router;
