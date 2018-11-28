// express module
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//#endregion

// express app
const app = express();

const PORT = 3300;

const EmployeeController = require('./Controllers/EmployeeController');

/**
 * App Middlewares
 */
app.use(morgan('dev'));
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	req.userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.header('Access-Control-Allow-Headers', 'Origin , X-Requested-With , authtoken, content-type , Accept , Authorization');
	next();
});
app.options('*', (req, res) => {
	res.end();
});

/**
 * Robots.txt for Server
 */
app.get('/robots.txt', (req, res) => {
	res.type('text/plain');
	res.send('User-agent: *\nDisallow: /');
});

new EmployeeController('/api/employee', app);

//#region end

/**
 * 404 Not Found
 */
app.use((req, res) => {
	res.status(404).json({
		error: 1,
		message: 'URL Not Found',
	});
});


app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server Started at PORT ${PORT}`);
});