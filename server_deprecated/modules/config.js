module.exports={
	AWS:{
		clientId:"[YOUR_CLIENT_ID]",
		productId: "[YOUR_PRODUCT_ID]",
		clientSecret:"[YOUR_CLIENT_ID]",
		scope:"alexa:all",
		scopeData:{
			"alexa:all": {
				"productID": "[YOUR_PRODUCT_ID]",
				"productInstanceAttributes":{
					"deviceSerialNumber": 123
				}
			}

		},

		responseType: "code",
		redirectUri: "https://localhost:8080/authresponse"
	},
	port: 8080,

	AVS:{
		HOST: "avs-alexa-eu.amazon.com",
		DIRECTIVES_PATH: "/v20160207/directives",
		EVENTS_PATH: "/v20160207/events",
		BOUNDARY_TERM: "LIMIT123",
		BOUNDARY_DASHES: "--",
		NEWLINE: "\n",
		CONTEXT_HEADER: "\n\n--" + "LIMIT123\n" + 'Content-Disposition: form-data; name="metadata"\nContent-Type: application/json; charset=UTF-8\n\n',
		AUDIO_HEADER: "\n\n--" + "LIMIT123\n" + 'Content-Disposition: form-data; name="audio"\nContent-Type: application/octet-stream;\n\n',
		MULTIPART_END_CONTEXT: '\n\n--LIMIT123--\n\n',
		MULTIPART_END_AUDIO: '\n\n--LIMIT123--\n\n'
	}
}
