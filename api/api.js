var express = require("express");
var router = express.Router();

var stats = require("./routes/stats");
var tree = require("./routes/tree");

router.use("/stats", stats);
router.use("/tree", tree);


module.exports = router;