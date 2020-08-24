// Publish 200 response.
// @param res{Object} The response object.
// @param data{Object} Data to send as JSON. Defaults to `{}`.
exports.send200 = (res, data={}) => {
	res.status(200).json(data).end()
}

// Publish 400 response with data.
//
// If `data` is a String, the string will be assigned to an object. Otherwise,
// `data` is sent.
// @param res{Object} The response object.
// @param data{String or Object} Message to send.
exports.send400 = (res, data) => {
	if (typeof(data) === 'string') {
		data = { msg: data }
	}

	res.status(400).json(data).end()
}

// Publish 404 response with data.
//
// If `data` is a String, the string will be assigned to an object. Otherwise,
// `data` is sent.
// @param res{Object} The response object.
// @param data{String or Object} Message to send.
exports.send404 = (res, data={}) => {
	if (typeof(data) === 'string') {
		data = { msg: data }
	}

	res.status(404).json(data).end()
}

// Publish 500 response with message
// @param res{Object} The response object.
// @param msg{String} Message to send.
exports.send500 = (res, data={}) => {
	res.status(500).json(data).end()
}
