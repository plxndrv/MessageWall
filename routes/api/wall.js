const express = require("express");
const router = express.Router();

//@route GET api/wall/test
//@desc Test wall route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Wall Works" }));

module.exports = router;
