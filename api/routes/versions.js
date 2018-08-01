var express = require("express");
var router = express.Router();
var data = require("../../core/db");

router.get("/", function(req, res, next) {
    return data.getVersions().then((files) => {
        return res.json(files.map(file => file.replace(".json", "")));
    });
});


module.exports = router;