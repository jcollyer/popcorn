const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var http = require('http').Server(app);
const path = require('path');
const fs = require('fs');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './app.env' });

const API_KEY = process.env.ZOOM_API_KEY;
const API_SECRET = process.env.ZOOM_API_SECRET;
const meetingId = 85735401067;

console.log('-------------------->>', { API_KEY, API_SECRET });

const payload = {
	iss: API_KEY,
	exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, API_SECRET);

app.get('/', (req, res) => {
	// email = 'collyerdesing@gmail.com';
	var options = {
		method: 'GET',
		// uri: `https://api.zoom.us/v2/report/meetings/${meetingId}/participants`,
		uri: `https://api.zoom.us/v2/metrics/meetings/${meetingId}/participants`,
		// uri: `https://api.zoom.us/v2/meetings/${meetingId}/registrants`,
		// body: {
		// 	topic: 'test meeting title',
		// 	type: 1,
		// 	settings: {
		// 		host_video: 'true',
		// 		participant_video: 'true',
		// 	},
		// },
		auth: {
			bearer: token,
		},
		headers: {
			'User-Agent': 'Zoom-api-Jwt-Request',
			'content-type': 'application/json',
		},
		json: true, //Parse the JSON string in the response
	};
	// console.log(options);
	rp(options)
		.then(function (response) {
			console.log('response is: ', response);
			res.send('create meeting result: ' + JSON.stringify(response));
		})
		.catch(function (err) {
			// API call failed...
			console.log('API call failed, reason ', err);
		});
});

http.listen(port, () => console.log(`Listening on port ${port}`));
