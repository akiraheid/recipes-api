const errorHandler = require('errorhandler')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

const app = express()
const mongostore = require('connect-mongo')(session)

const {
	LISTEN_PORT,
	MONGO_DB,
	MONGO_HOSTNAME,
	MONGO_PASSWORD,
	MONGO_PORT,
	MONGO_USERNAME,
	NODE_ENV,
	SESSION_SECRET,
} = process.env

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

const main = () => {
	// Unused import but needs to configure passport prior to initializtion
	require('./passport')


	// Configure app
	app.set('host', '0.0.0.0')
	app.set('port', LISTEN_PORT || 8080)
	app.use(express.json())
	app.use(express.urlencoded())
	app.use(session({
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
		store: new mongostore({
			url: MONGO_URI,
			autoReconnect: true,
		})
	}))
	app.use(passport.initialize())
	app.use(passport.session())

	// Set routes
	app.use('/auth', require('./routes/auth'))
	app.use('/recipe', require('./routes/recipe'))
	app.use('/user', require('./routes/user'))
	app.disable('x-powered-by')

	// Deployment settings
	if (NODE_ENV === 'development') {
		// Only use in development
		app.use(errorHandler())
	} else {
		app.use((err, req, res, _) => {
			console.error('server error', err)
			res.sendStatus(500)
		})
	}

	// Start app
	app.listen(app.get('port'), () => {
		const url = `http://localhost:${app.get('port')}`
		console.log(`App is running at ${url} in ${app.get('env')} mode`)
		console.log('Press CTRL-C to stop\n')
	})
}

// Mongoose setup
const mongoOptions = {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500,
	connectTimeoutMS: 10000,
}

console.log(`Connecting to MongoDB at ${MONGO_URI}`)
mongoose.connect(MONGO_URI, mongoOptions)
	.then(() => {
		console.log('Connected to MongoDB')
		main()
	})
	.catch((err) => {
		console.log(err)
	})
