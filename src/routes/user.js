const express = require('express')
const router = express.Router()

const db = require('../db')
const passport = require('../passport')
const util = require('../util')

// Return an error string that describes the problem with the given password;
// null otherwise.
const checkPassword = (pass) => {
	return pass.length < 8 ? 'Password must be at least 8 characters' : null
}

// Delete a user
router.delete('/:id', async (req, res) => {
	const username = req.params.id
	if (!username) { return res.sendStatus(400) }

	const deleted = await db.deleteUser(username)
	if (deleted.n === 1) { return res.sendStatus(200) }

	res.sendStatus(400)
})

// Get private information about a user
router.get('/:id', passport.isAuthenticated, async (req, res, next) => {
	const username = req.params.id

	// Requesting another user's data. Forward onto public route
	if (username !== req.user.name) { return next('route') }

	const data = await db.getPrivateProfileData(username)
	if (data) { return util.send200(res, data) }

	return res.sendStatus(400)
})

// Get public information about a user.
router.get('/:id', async (req, res) => {
	const username = req.params.id

	const data = await db.getPublicProfileData(username)
	if (data) { return util.send200(res, data) }

	return res.sendStatus(400)
})

// Create a user account.
router.post('/', async (req, res) => {
	if (!req.body.username || !req.body.password) { return res.sendStatus(400) }

	const username = req.body.username
	const password = req.body.password

	const invalidReason = checkPassword(password)
	if (invalidReason) { return util.send400(res, invalidReason) }

	if (await db.usernameExists(username)) { return res.sendStatus(400) }

	const user = await db.createUser(username, password)
	req.login(user, async (err) => {
		if (err) { return util.send500(res) }

		// recipes doesn't need to be populated because it's an empty list
		const data = await db.getPrivateProfileData(req.user.name)

		return util.send200(res, data)
	})
})

module.exports = router
