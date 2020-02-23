const express = require('express');
// const bodyParser = require('body-parser');
const user = require("./routes/user");
const InitiateMongoServer = require('./config/db');
const cors = require('cors');

InitiateMongoServer();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({message: "API Working"});
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
*/

app.use("/user", user);

app.listen(PORT, (req, res) => {
  console.log(`Server is listening on PORT ${PORT}`);
});
