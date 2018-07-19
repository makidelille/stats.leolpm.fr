const Bluebird = require("bluebird");
const {Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const winston = require('winston');
const { combine, timestamp, label, printf, colorize } = winston.format;
const fs = require("fs");
const {json2csv} = require('json-2-csv');

const outputFile = (new Date()).toLocaleDateString("fr").replace("/", "_");

const logFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

winston.configure({
  transports: [
    new winston.transports.File({ filename: `${outputFile}.log`, level:"info"}),
    new winston.transports.Console({
      level: "info",
      prettyPrint: true
    })
  ],
  format: combine(
    label({ label: `batch ${outputFile}` }),
    timestamp(),
    logFormat
  ),
});


const options = new chrome.Options()
  .addArguments("--disable-extensions")
  .setUserPreferences({
    "profile.default_content_setting_values.images":2
});

const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

let stats = {
  clubPageCount: 0,
  membresPageCount: 0
};


function connect(username, passwd) {
   winston.info("debut de traitement");
    return driver.get("http://www.lions-france.org/accueil-1.html")
      .then(_ => driver.wait(until.elementLocated(By.css("form[name='formulaire']"))))
      .then(_ => driver.findElement(By.css('input[name="login"]')).sendKeys(username))
      .then(_ => driver.findElement(By.css('input[name="mdp"]')).sendKeys(passwd))
      .then(_ => driver.findElement(By.css('input[name="envoyer"]')).click())
      .then(_ => driver.get('http://www.lions-france.org/lionsadmin'))
      .then(_ => winston.info("Connected to back office"));
}

function getHTML(){
    let clubHTML = [];

    function extractPromise() {
      stats.clubPageCount++;
      winston.info(`processing page ${stats.clubPageCount} of search`);
      return driver.findElements(By.css('table.listing tr'))
        .then(trs => Bluebird.all(trs.map(tr => tr.getAttribute("outerHTML"))))
        .then(htmls => clubHTML = clubHTML.concat(htmls))
        .then(_ => driver.findElement(By.css('a[title="Page suivante"]')).click())
        .then(_ => extractPromise());
      }
  
    return driver.findElement(By.css("#menu > ul > li:nth-child(4)")).click()
      .then(_ => driver.findElement(By.css("input[value='Rechercher']")).click())
      .then(_ => extractPromise().catch(err => {
        // ELEMENT NOT found
        return Bluebird.resolve();
      }))
      .then(_ => clubHTML);
}

function parseHTML(htmls){  
  winston.info("Processing received HTML");
  let clubs = [];

  for(let html of htmls){
    let regx = /onclick=".*club_id=(\d*).*?"><td>?(.*?)<\/td><td>?<b>(.*?)<\/b><\/td><td>?(.*?)<\/td><td>?(.*?)<\/td><td>?(.*?)<\/td><td>?(.*?)<\/td>/g
    let matches = regx.exec(html);
  
    if(matches){
      let obj ={
        club_id: matches[1],
        district: matches[2],
        club: matches[3],
        cp: matches[4],
        ville: matches[5],
        status: matches[6], 
        Type: matches[7],
        membres: []
      }

      clubs.push(obj);
    }
  }
  winston.info("End processing of club HTML");
  return clubs;
}

function getDetails(clubs){
  let promises = clubs.map(club => {
    let membreids = []
    let page = 0;

    function extract(){
      page++;
      winston.info(`Getting membre page ${page} of club ${club.club_id}`);
      return driver.findElements(By.css("table.listing  tr"))
        .then(elements => Bluebird.map(elements, ele => ele.getAttribute("outerHTML")))
        .then(htmls => htmls.map(html => {
          let re = /onclick=".*membre_id=(\d*).*?">/g;
          let matches = re.exec(html);
          return matches ? matches[1] : null;
        }).filter(a => a != null))
        .then(membre_ids => membreids = membreids.concat(membre_ids))
        .then(_ => driver.findElement(By.css("p.pager a[title='Page suivante']")).click())
        .then(_ => extract());
    }

    return driver.get(`http://www.lions-france.org/lionsadmin/index.php?do=resultat_membre&membre[club_id]=${club.club_id}&membre[membre_sit_id]=0`)
    .then(_ => extract().catch(Bluebird.resolve))
    .then(_ => Bluebird.map(membreids, getInfoMembre))
    .then(membreinfos => {
      club.membres = membreinfos;
      return club
    });
  }
    
  );

  return Bluebird.all(promises);
}

function getInfoMembre(membreid){
  stats.membresPageCount++;
  winston.info(`getting infor for membre: ${membreid}, (count: ${stats.membresPageCount})`);
  let membre = {
    age:null,
    sexe: null
  };

  return driver.get(`http://www.lions-france.org/lionsadmin/index.php?do=affiche_membre&membre_id=${membreid}&pageID=`)
  .then(_ => driver.findElement(By.css("table.formu2 > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > p > b")).getText())
  .then(ele => membre.sexe = ele.startsWith("Madame") ? "F" : ele.startsWith("Monsieur") ? "M" : "NA")
  .then(_ => driver.findElement(By.css("table.formu2 > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(2)")).getText())
  .then(datest => {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    var dt = new Date(datest.replace(pattern,'$3-$2-$1'));
    membre.age = (new Date()).getFullYear() - dt.getFullYear();
  }).catch(err => {
    console.error(err);
    return Bluebird.resolve()
  }).then(_ => membre);
}

function convert(clubs, format='json'){
  winston.info(`finished getting ${stats.clubPageCount} pages of club and ${stats.membresPageCount} pages of membres, exporting`);

  return Bluebird.resolve().then(_ => {
    if(format === 'csv'){
      return new Bluebird((resolve, reject) => {
        json2csv(clubs, (err, csv) => {
          if(err) return reject(err);
          else return resolve(csv);
        });
      });
    } else {
      return Bluebird.resolve(JSON.stringify(clubs));
    }
  }).then(data => {
    fs.writeFileSync(outputFile + "." + format, data);
    return outputFile + "." + format
  });


}

const username = "juliendonque@gmail.com";
const passwd = "UHRA2PQ";
//MAIN FONCTION
return connect(username, passwd)
.then(getHTML)
.then(parseHTML)
.then(getDetails)
.then(clubs => convert(clubs))
.then(_ => driver.quit())
.then(out => winston.info(`finis, resultat: ${out}`));