const Recipe = require('./models/Recipe')
const User = require('./models/User')

// Add a new pantry item to a user's pantry.
exports.addPantryItem = async (userId, item) => {
	let success = false
	try {
		await User.findByIdAndUpdate(userId,
			{ $push: { pantry: item } },
			{ runValidators: true, upsert: true })

		success = true
	} catch (err) { console.error(err) }
	return success
}

// Create a new user and return an error if creating the user failed.
exports.createUser = async (username, password) => {
	return await User.create({ name: username, password: password })
}

// Delete a pantry item
exports.deletePantryItem = async (userId, itemId) => {
	try {
		const user = await User.findByIdAndUpdate(userId,
			{ $pull: { 'pantry': { _id: itemId } } })

		if (!user) { return false }
	} catch (err) { console.error(err) }

	return true
}

// Delete a recipe and remove it from the user that owns it
exports.deleteRecipe = async (id) => {
	let deleted = {}
	try {
		const user = await exports.getRecipeOwner(id)

		// No user owns the recipe
		if (!user) { return deleted }

		const updated = await User.updateOne(
			{ _id: user._id },
			{ $pull: { recipes: id } },
		)
		if (!updated.ok) { return deleted }

		deleted = await Recipe.deleteOne({_id: id})
	} catch (err) { console.error(err) }
	return deleted
}

// Delete a user
exports.deleteUser = async (username) => {
	return await User.deleteOne({ name: username })
}

// Return a user's pantry items
exports.getPantry = async (userId) => {
	const user = await User.findById(userId, 'pantry').lean()
	return user.pantry
}

// Get the user's private profile data.
exports.getPrivateProfileData = async (username) => {
	return await User.findOne({ name: username }, 'name recipes pantry')
		.populate('recipes', 'name').lean()
}

// Get the user's public profile data.
exports.getPublicProfileData = async (username) => {
	return await User.findOne({ name: username }, 'name recipes')
		.populate('recipes', 'name').lean()
}

exports.getRecipeById = async (id) => {
	let recipe = undefined

	try {
		recipe = await Recipe.findById(id, 'directions ingredients name servings')
			.populate('ingredients').lean()
	} catch (err) { console.error(err) }
	return recipe
}

// Return the User Object that owns the recipe.
exports.getRecipeOwner = async (id) => {
	let user = undefined

	try {
		user = await User.findOne({ recipes: id }).lean()
	} catch (err) { console.error(err) }
	return user
}

// Find recipes that match the given term.
exports.findRecipes = async (term) => {
	return await Recipe.find({
		$or: [
			{ name: new RegExp(term, 'i') },
			{ 'ingredients.name': new RegExp(term, 'i') },
		]
	}, 'name directions ingredients servings').lean()
}

// Update an existing pantry item
exports.updatePantryItem = async (item) => {
	let success = false
	try {
		await User.updateOne({ 'pantry._id': item._id }, {
			$set: {
				'pantry.$.amount': item.amount,
				'pantry.$.expire': item.expire,
				'pantry.$.name': item.name,
				'pantry.$.unit': item.unit,
			}
		}, { runValidators: true, upsert: true })

		success = true
	} catch (err) { console.error(err) }
	return success
}

// Return if the given username exists.
exports.usernameExists = async (username) => {
	return await User.findOne({ name: username }) ? true : false
}
