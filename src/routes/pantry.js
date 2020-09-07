const express = require('express')
const router = express.Router()

const db = require('../db')
const passport = require('../passport')
const util = require('../util')

// Authenticated request to delete a pantry item.
router.delete('/:id', passport.isAuthenticated, async (req, res) => {
	const itemId = req.params.id

	// Check user has pantry item
	const matches = req.user.pantry.filter((item) => item._id === itemId)

	if (!matches) { return res.sendStatus(400) }

	const deleted = await db.deletePantryItem(req.user._id, itemId)
	if (!deleted) { return res.sendStatus(500) }
	return res.sendStatus(200)
})

// Unauthenticated DELETE requests
router.delete('/:id', async (_, res) => { res.sendStatus(400) })

// Authenticated GET
router.get('/', passport.isAuthenticated, async (req, res) => {
	const pantry = await db.getPantry(req.user._id)
	return util.send200(res, pantry)
})

// Unauthenticated GET
router.get('/', async (req, res) => res.sendStatus(400))

// Authenticated POST
router.post('/', passport.isAuthenticated, async (req, res) => {
	const item = util.getPantryItem(req)

	// New item
	if (!item._id) {
		const success = await db.addPantryItem(req.user._id, item)
		if (!success) { return res.sendStatus(400) }
		return res.sendStatus(200)
	}

	// Existing item
	const success = await db.updatePantryItem(item)
	if (!success) { return res.sendStatus(400) }
	return res.sendStatus(200)
})

// Unauthenticated POST
router.post('/', (req, res) => { res.sendStatus(400) })

module.exports = router
