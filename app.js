// including packages
const express = require("express");
const path = require("path");

// including routehandlers
const authRouter = require("./backend/routes/auth_router");
const eventRouter = require("./backend/routes/event_router");
const detailRouter = require("./backend/routes/detail_router");
const groupRouter = require("./backend/routes/group_router");
const passwordRouter = require("./backend/routes/password_router");
const addressRouter =require("./backend/routes/address_router");
const userRouter= require("./backend/routes/user_router")
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
app.use("/api", eventRouter);
app.use("/api", detailRouter);
app.use("/api", groupRouter);
app.use("/api/password", passwordRouter);
app.use("/api/address",addressRouter);
app.use("/api",userRouter);

// exporting the express server, so we can use it in server.js
module.exports = app;