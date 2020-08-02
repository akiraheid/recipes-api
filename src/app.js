const errorHandler = require('errorhandler')
const express = require('express')

const app = express()

const { LISTEN_PORT, NODE_ENV } = process.env

// Configure app
app.set('host', '0.0.0.0')
app.set('port', LISTEN_PORT || 8080)
app.use(express.json())
app.use(express.urlencoded())

app.disable('x-powered-by')

// Deployment settings
if (NODE_ENV === 'development') {
	// Only use in development
	app.use(errorHandler())
} else {
	app.use((err, req, res, _) => {
		console.error(err)
		res.status(500).send('Server Error')
	})
}

// Start app
app.listen(app.get('port'), () => {
	const url = `http://localhost:${app.get('port')}`
	console.log(`Running at ${url} in ${app.get('env')} mode`)
	console.log('Press CTRL-C to stop\n')
})
