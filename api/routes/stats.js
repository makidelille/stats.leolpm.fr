var express = require("express");
var router = express.Router();
var data = require("../../core/db");

router.get("/", function(req, res, next) {
    return data.getClubs().then((clubs) => {
        let json = clubs.map(club => {
            let h=0, f=0;
            let ages = {};
            let ageMoyen = 0, ageMax = 0, ageMin = 0;
            club.membres.forEach(function(membre){
                switch(membre.sexe){
                    case "M": 
                    h++;
                    break;
                    case "F":
                    f++;
                    break;
                }
                
                var age = membre.age;
                if(age === null || age === undefined){
                    return;
                }
                
                if(ages[age] === undefined){
                    ages[age] = 0;
                }
                
                if(age < ageMin){
                    ageMin = age;
                }
                
                if(age > ageMax){
                    ageMax = age;
                }
                ages[age]++;
                ageMoyen += age;
            });

            var parite = h / club.membres.length;
            ageMoyen = ageMoyen / club.membres.length;

            return {
                district: club.district,
                ville: club.ville,
                club: club.club,
                membresCount: club.membres.length,
                parite: parite,
                mCount: h,
                fCount: f,
                ageMoyen: ageMoyen,
                ageMin: Math.max(ageMin, 18),
                ageMax: ageMax,
                ages: ages
            };
        });

        return res.json(json);
    });

});


module.exports = router;