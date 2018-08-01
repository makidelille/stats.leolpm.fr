const express = require("express");
const Bluebird = require("bluebird");
const router = express.Router();
const data = require("../../core/db");

router.get("/", function(req, res, next) {
    let version = req.query.version;
    if(version === undefined || version == "latest"){
        version = "latest"; //TODO latest
    }

    if(typeof version != 'string'){
        return next({status: 400, msg: "Invalid version format"});
    }

    if(!version.length){
        return next({status: 400, msg: "no version specified"});
    }
  
    return data.getClubs(version + ".json").then((clubs) => {
        let json = clubs.map(data.filterStats);

        return res.json(json);
    }).catch(err => {
      console.error(err);
      if(err.code === "ENOENT"){
          return next({status: 404, msg: "version doesn't exist"});
      }  else{
          return next({status: 500, msg: "Internal serveur error"});
      }
    });

});

router.get("/hist", function(req, res, next){
    let club = req.query.club;
    let district = req.query.district;
    let ville = req.query.ville;
    if(!club && !district && !ville){
        return next({status: 400, msg: "no filter given"});
    }

    if((club && typeof club != 'string') || ( ville && typeof ville != "string") || (district && typeof district != "string")){
        return next({status: 400, msg: "invalid filter type"});
    }
    console.log(club, district, ville);
    return data.getVersions().then(versions => {
        console.log(versions);
        Bluebird.mapSeries(versions, version => 
            data.getClubs(version).then(dataArray => {
                console.log("found version data:", version)
                // filter data
                let matches = dataArray.filter(v => {
                    if(club) {
                        return v.club === club;
                    } else if(ville){
                        return v.ville === ville;
                    } else {
                        return v.district === district;
                    }
                });                
                let value = data.filterJoinStats(matches);
                
                console.log("filter data, version:", version, "length:", matches.length);

                return value;
            }).then(value => ({version, value})
        )).then(results => {
            return res.json(results);
        });
    });
});


module.exports = router;