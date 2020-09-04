const express = require('express')
const router = express.Router()

const Recipe = require('../models/Recipe')
const User = require('../models/User')

const db = require('../db')
const passport = require('../passport')
const util = require('../util')

// Authenticated request to delete a recipe.
router.delete('/:id', passport.isAuthenticated, async (req, res) => {
	const recipeId = req.params.id

	const recipeOwner = await db.getRecipeOwner(recipeId)
	if (!recipeOwner || recipeOwner.name !== req.user.name) {
		return util.send400(res)
	}

	const deleted = await db.deleteRecipe(recipeId)
	if (!deleted.ok) { return util.send500(res) }
	return util.send200(res)
})

// Unauthenticated DELETE requests
router.delete('/:id', async (_, res) => { res.sendStatus(400) })

// Unauthenticated GET request for a specific recipe.
router.get('/:id', async (req, res) => {
	const id = req.params.id

	const recipe = await db.getRecipeById(id)
	if (!recipe) { return util.send400(res) }

	return util.send200(res, recipe)
})

// Authenticated recipe post.
router.post('/', passport.isAuthenticated, async (req, res) => {
	const recipe = req.body

	const ingredients = []
	for (const ingredient of recipe.ingredients) {
		const newIngredient = {
			amount: Number(ingredient.amount),
			name: ingredient.name,
			note: ingredient.note || '',
			prep: ingredient.prep || '',
			unit: ingredient.unit,
		}
		ingredients.push(newIngredient)
	}

	const newRecipe = new Recipe({
		directions: recipe.directions,
		ingredients: ingredients,
		name: recipe.name,
		servings: recipe.servings,
	})

	const err = newRecipe.validateSync()
	if (err) { return util.send400(res, 'Invalid recipe format') }

	try {
		await newRecipe.save()
	} catch (err) {
		return res.status(500).json({}).end()
	}

	const result = await User.findByIdAndUpdate(req.user._id, {
		$push: { recipes: newRecipe._id}
	})

	if (!result) { return res.status(500).json({}).end() }

	return res.status(200).json({}).end()
})

// Unauthenticated POST requests
router.post('/', async (_, res) => { res.sendStatus(400) })

module.exports = router
