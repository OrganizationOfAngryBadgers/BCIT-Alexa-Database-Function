'use strict'
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-west-2",
	endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var storage = (function() {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	return {
		save: function(color, session, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Item: {
					eventID: session.user.userId,
					name: color
				}
			};
			dynamodb.put(params, function(err, data) {
				callback(color);
			})
		},
		saveTest: function(eventsJSON, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Item: {
					description: "eventsJSON[i].description",
					endTime: "eventsJSON[i].end_time",
					name:" eventsJSON[i].name",
					pname: "eventsJSON[i].pname",
					city: "eventsJSON[i].city",
					country: "eventsJSON[i].country",
					latitude: "eventsJSON[i].latitude",
					longitude: "eventsJSON[i].longitude",
					state: "eventsJSON[i].state",
					street: "eventsJSON[i].street",
					zip: "eventsJSON[i].zip",
					startTime: "eventsJSON[i].start_time",
					eventID: "eventsJSON[i].id"
				}
			};
			dynamodb.put(params, function(err, data) {
				callback(eventsJSON);
			})
		},
		saveEvents: function(json, callback) {
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
							endTime: "" + eventsJSON[i].end_time,
							name: "" + eventsJSON[i].name,
							pname: "" + eventsJSON[i].pname,
							city: "" + eventsJSON[i].city,
							country: "" + eventsJSON[i].country,
							latitude: "" + eventsJSON[i].latitude,
							longitude: "" + eventsJSON[i].longitude,
							state: "" + eventsJSON[i].state,
							street: "" + eventsJSON[i].street,
							zip: "" + eventsJSON[i].zip,
							startTime: "" + eventsJSON[i].start_time
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
		},
		getEvent: function(name, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Key: {
					Name: name,
				}
			};
			dynamodb.get(params, function(err, data) {
				callback(data.Item.name);
			});
		}
	}
})();

module.exports = storage;
