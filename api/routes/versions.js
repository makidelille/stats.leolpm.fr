var express = require("express");
var router = express.Router();
var data = require("../../core/db");

router.get("/", function(req, res, next) {
    return data.getVersions().then(files => res.json(files));
});


module.exports = router;