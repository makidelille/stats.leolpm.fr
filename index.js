"use strict";

const config = require("./config");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const port = config.server.port;
const fs = require("fs");
const path = require("path");
let httpserver;

function buildApp(){
    const app = express();

    app.disable("x-powered-by");
    app.set("json spaces", config.debug ? 2 : 0);
    app.all("/*", (req, res, next) => {
        // CORS headers
        // restrict it to the required domain
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

        // Set custom headers for CORS
        res.header("Access-Control-Allow-Headers", "Content-type,Accept");
        if (req.method === "OPTIONS") {
            res.status(200).end();
        } else {
            next();
        }
    });

    app.use(logger("dev"));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
    app.use(bodyParser.json({ limit: "50mb" }));
    app.set("view engine", "ejs");
    app.set("port", config.server.port);

    app.get("/mon/ping", (req, res) => res.status(200).end(null));

    app.use(express.static(path.join(__dirname, "client")));
    app.use(express.static(path.join(__dirname, "node_modules")));

    app.use((req, res) => {
        return res.status(404).json(`${req.originalUrl} doesn't exist`);
    });

    return app;
}

if (require.main === module) {
  console.log(`Serveur listening on port ${port}`);
  httpserver = http.createServer(buildApp()).listen(port);
}
