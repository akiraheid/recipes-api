/*global afterEach, beforeEach*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

// Global test URL
const URL = 'http://localhost:8080'
exports.testUrl = URL

const testUsername = 'testtest'
exports.testUsername = testUsername

// Add recipe to user.
exports.addRecipe = async (username, recipe) => {
	const agent = exports.createAgent()
	const loginRes = await agent.post('/auth/login')
		.send({ username: username, password: username })

	const recipeSend = recipe || exports.createRecipe()
	const res = await agent.post('/recipe').send(recipeSend)
	agent.close()

	expect(loginRes).to.have.status(200)
	expect(res).to.have.status(200)
}

// Creates and returns a Chai HTTP request agent.
exports.createAgent = () => {
	return chai.request.agent(URL)
}

// Return an ingredient object.
exports.createIngredient = () => {
	return {
		name: 'ingredient',
		amount: 1,
		unit: 'oz',
		prep: 'prep',
		note: 'note'
	}
}

// Return a recipe object.
exports.createRecipe = () => {
	const ingredient = exports.createIngredient()
	return {
		name: 'recipe',
		servings: 4,
		ingredients: [ingredient, ingredient],
		directions: ['Put the lime in the coconut.', 'Drank \'em both up.']
	}
}

// Create a user with the specified username. The password is the same as the
// username.
exports.createUser = async (username) => {
	const res = await chai.request(URL)
		.post('/user')
		.send({ username: username, password: username })

	expect(res).to.have.status(200)
}

// Send a DELETE request to the the given path and return the response.
exports.delete = async (path) => {
	return await chai.request(URL).delete(path)
}

// Delete a recipe owned by a user if it exists.
exports.deleteRecipe = async (id, username) => {
	if (!(await exports.recipeExists(id))) { return }

	const agent = exports.createAgent()
	const loginRes = await agent.post('/auth/login')
		.send({ username: username, password: username })

	const res = await agent.delete(`/recipe/${id}`)
	agent.close()

	expect(loginRes).to.have.status(200)
	expect(res).to.have.status(200)
}

// Delete a user if it exists.
exports.deleteUser = async (username) => {
	if (!(await exports.userExists(username))) { return }

	const agent = exports.createAgent()
	const loginRes = await agent.post('/auth/login')
		.send({ username: username, password: username })

	const res = await agent.delete('/user')
	agent.close()

	expect(loginRes).to.have.status(200)
	expect(res).to.have.status(200)
}

// Mocha before/afterEach hooks that creates a test user before the test and
// delete the user after the test.
exports.freshUserHooks = async () => {
	beforeEach('recreate user', async () => {
		await exports.deleteUser(testUsername)
		await exports.createUser(testUsername)
	})

	afterEach('delete test user', async () => {
		await exports.deleteUser(testUsername)
	})
}

// Send a GET request to the the given path and return the response.
exports.get = async (path) => {
	return await chai.request(URL).get(path)
}

// Get the recipes for a user.
exports.getRecipes = async (username) => {
	const res = await exports.get(`/user/${username}`)
	expect(res).to.have.status(200)
	expect(res).to.have.property('body')
	expect(res.body).to.have.property('recipes')
	return res.body.recipes
}

// Login as username. Returns an agent used in the login process for the auth
// token it holds.
exports.loginAs = async (username) => {
	const agent = exports.createAgent()
	const res = await agent.post('/auth/login')
		.send({ username: username, password: username })

	if (res.status !== 200) { console.error(`Failed to login as ${username}`) }
	return agent
}

// Return boolean for if the recipe exists.
exports.recipeExists = async (id) => {
	const res = await exports.get(`/recipe/${id}`)
	return res.status === 200
}

// Boolean returned for if the user exists.
exports.userExists = async (username) => {
	const res = await exports.get(`/user/${username}`)
	return res.status === 200
}
