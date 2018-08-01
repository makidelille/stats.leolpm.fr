var express = require("express");
var router = express.Router();

var stats = require("./routes/stats");
var tree = require("./routes/tree");
var versions = require("./routes/versions");

router.use("/stats", stats);
router.use("/tree", tree);
router.use("/versions", versions);


router.use(function(err, req, res, next){
    if(err && err.status){
        return res.status(err.status).json(err.msg);
    }
})

module.exports = router;