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

// Creates and returns a Chai HTTP request agent.
exports.createAgent = () => {
	return chai.request.agent(URL)
}

// Create a user with the specified username. The password is the same as the
// username.
exports.createUser = async (username) => {
	const res = await chai.request(URL)
		.post('/user')
		.send({ username: username, password: username })

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

// Login as username. Returns an agent used in the login process for the auth
// token it holds.
exports.loginAs = async (username) => {
	const agent = exports.createAgent()
	const res = await agent.post('/auth/login')
		.send({ username: username, password: username })

	if (res.status !== 200) { console.error(`Failed to login as ${username}`) }
	return agent
}

// Boolean returned for if the user exists.
exports.userExists = async (username) => {
	const res = await chai.request(URL).get(`/user/${username}`)
	return res.status === 200
}
