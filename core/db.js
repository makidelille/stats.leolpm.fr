const Bluebird = require("bluebird");
const fs = require("fs");
const path = require("path");

const dataFolder = path.resolve(__dirname, "../data/");

function getClubs(version){
    if(version === undefined || version  === 'latest'){
        return getVersions()
            .then(versions => versions[versions.length - 1])
            .then(getClubs);
    }

    return new Bluebird((resolve, reject) =>  {
        let file = path.resolve(dataFolder, version + ".json");
        fs.readFile(file, (err, data) => {
            if(err) return reject(err);
            try{
                return resolve(JSON.parse(data));
            } catch (err){
                console.error("Syntax error in json", file);
                return resolve([]);
            }
        });
    });   
}

function getVersions(){
    return new Bluebird((resolve, reject) => {
        fs.readdir(dataFolder, (err, files) => {
            if(err) return reject(err);
            return resolve(files.map(file => file.replace(".json", "")));
        });

    })

}

function filterStats(club){
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
        if(age === null || age === undefined || age < 0){
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
        ageMin: ageMin,
        ageMax: ageMax,
        ages: ages
    };
}

function filterJoinStats(clubs){
    let h=0, f=0;
    let ages = {};
    let ageMoyen = 0, ageMax = 0, ageMin = 0;
    let parite = 0;
    let membresCount = 0;
    clubs.forEach(club => {
        club.membres.forEach(function(membre){
            membresCount++;
            switch(membre.sexe){
                case "M": 
                    h++;
                    break;
                case "F":
                    f++;
                    break;
            }
            
            let age = membre.age;
            if(age === null || age === undefined || age < 0){
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
    });

    parite = h / membresCount;
    ageMoyen = ageMoyen / membresCount;

    return {
        membresCount: membresCount,
        parite: parite,
        mCount: h,
        fCount: f,
        ageMoyen: ageMoyen,
        ageMin: Math.max(ageMin, 18),
        ageMax: ageMax,
        ages: ages
    };
}



module.exports = {
    getClubs,
    getVersions,
    filterStats,
    filterJoinStats
}
