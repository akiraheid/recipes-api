const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User')

const util = require('../util')

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, _) => {
		if (err) { return next(err) }
		if (!user) {
			console.warn(`Failed login attempt for user ${req.body.username}`)
			return util.send400(res, 'Invalid username or password')
		}

		req.login(user, async (err) => {
			if (err) { return next(err) }
			const data = await User
				.findById(user._id, 'name recipes pantry')
				.populate('recipes', 'name').lean()

			return util.send200(res, data)
		})
	})(req, res, next)
})

router.post('/logout', (req, res) => {
	req.logout()
	return res.sendStatus(200)
})

module.exports = router
