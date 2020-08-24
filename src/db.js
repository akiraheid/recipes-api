const Recipe = require('./models/Recipe')
const User = require('./models/User')

// Create a new user and return an error if creating the user failed.
exports.createUser = async (username, password) => {
	return await User.create({ name: username, password: password })
}

// Delete a user
exports.deleteUser = async (username) => {
	return await User.deleteOne({ name: username })
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

// Return if the given username exists.
exports.usernameExists = async (username) => {
	return await User.findOne({ name: username }) ? true : false
}
