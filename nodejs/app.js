const setTimezone = require('set-tz');
setTimezone('Europe/Ljubljana');

const express = require('express');
const passport = require('passport');
const schedule = require('node-schedule');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const api = require('./routes/api');
const db = require('./db');

const app = express();

app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: true, credentials:true}));
app.use(cookieParser());
app.use('/api', api);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

const port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log(`openTravian app listening on ${port}!`);
});