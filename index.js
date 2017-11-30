'use strict'
var AWS = require("aws-sdk");
var requester = require('request-promise');
const FB_API_URL = "fb-events-alexa.herokuapp.com";
var moment = require('moment');

AWS.config.update({
	region: "us-west-2",
	endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

exports.handler = function (event, context, callback) {

	if ((event.Records[0].Sns.Message).localeCompare("UpdateDatabase") == 0) {
		getEvents();
	} 



	
};

function getEvents() {
	var json;
	const getEventsAPI = function getEventsAPI () {
		console.log("API START GET EVENTS");
		return requester('https://fb-events-alexa.herokuapp.com/getEvents', function (error, response, eventsJSON) {
			console.log("API CALLBACK");
			console.log(eventsJSON);
			json = eventsJSON; 
		});
	}

	getEventsAPI().then(
		(response) => {
	      	saveEvents(json, (eventsJSON) => {
				console.log("Database Updating");
			});
		},
		(error) => {

			console.log("API Request Failed");
		}

	);
}

function saveEvents(json, callback) {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	console.log("Building events");
	var eventsJSON = JSON.parse(json);
	var items = [];
	for (var i = 0; i < eventsJSON.length; i++) {
		var event = eventsJSON[i];
		var request = {
			PutRequest: {
				Item: {
					eventID: "" + eventsJSON[i].id,
					description: "" + eventsJSON[i].description,
					endTime: "" + moment(eventsJSON[i].end_time).unix(),
					name: "" + eventsJSON[i].name,
					pname: "" + eventsJSON[i].pname,
					city: "" + eventsJSON[i].city,
					country: "" + eventsJSON[i].country,
					latitude: "" + eventsJSON[i].latitude,
					longitude: "" + eventsJSON[i].longitude,
					state: "" + eventsJSON[i].state,
					street: "" + eventsJSON[i].street,
					zip: "" + eventsJSON[i].zip,
					startTime: "" + moment(eventsJSON[i].start_time).unix()
				}
			}
		}
		items.push(request);
	}

	var params = {
		RequestItems: {
			"BCIT_SA_Events": items
		}
	}
	console.log("Writing events");
	dynamodb.batchWrite(params, function(err, data) { 
	  if (err) {
	    console.log("Error", err);
	  } else {
	    console.log("Success", data);
	  }
		callback("Database Updated");
	});
}
