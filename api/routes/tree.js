var express = require("express");
var router = express.Router();
var data = require("../../core/db");

router.get("/", function(req, res, next) {
    let version = req.query.version;
    if(version === undefined){
        version = "latest";
    }

    if(typeof version != 'string'){
        return next({status: 400, msg: "Invalid version format"});
    }

    if(!version.length){
        return next({status: 400, msg: "no version specified"});
    }

    return data.getClubs(version).then((clubs) => {
        let tree = {}
        clubs.forEach(clubInfos => {
            let district = clubInfos.district;
            let ville = clubInfos.ville;
            let club = clubInfos.club;
            if(tree[district] === undefined){
                tree[district] = {};
            }

            if(tree[district][ville] === undefined){
                tree[district][ville] = [];
            }

            tree[district][ville].push(club);
        });

        return res.json(tree);
    });

});


module.exports = router;