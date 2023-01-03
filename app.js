// including packages
const express = require("express");
const path = require("path");



// including routehandlers
const authRouter = require("./backend/routes/auth_router");

// including middlewares

// including utils


const app = express();

app.use(express.json());

// to host images
app.use("/assets", express.static(path.join("backend/assets")));

// this code is needed as we are hosting the server on a different url
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.use("/api/auth", authRouter);

  // exporting the express server, so we can use it in server.js
module.exports = app;