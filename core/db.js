const Bluebird = require("bluebird");
const fs = require("fs");
const path = require("path");


function getClubs(){
    return new Bluebird((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, "../data/latest.json"), (err, data) => {
            try{
                return resolve(JSON.parse(data));
            } catch (err){
                return reject(err);
            }
        });
    });    
}



module.exports = {
    getClubs
}
