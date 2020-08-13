/*global afterEach, beforeEach*/
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

// Global test URL
const URL = 'http://localhost:8080'
exports.testUrl = URL

const testUsername = 'testtest'
exports.testUsername = testUsername

exports.createTestUser = async () => {
	const res = await chai.request(URL)
		.post('/user')
		.send({ username: testUsername, password: testUsername })

	return res.status === 200
}

exports.deleteTestUser = async () => {
	await exports.deleteUser(testUsername)
}

exports.createAgent = () => {
	return chai.request.agent(URL)
}

exports.createUser = async (username, agent) => {
	const req = agent || chai.request(URL)

	return await req.post('/user')
		.send({ username: username, password: username })
}

exports.deleteUser = async (username) => {
	await chai.request(URL)
		.delete(`/user/${username}`)
}

exports.freshTestUserHooks = async () => {
	beforeEach('recreate user', async () => {
		await exports.deleteTestUser()
		await exports.createTestUser()
	})

	afterEach('delete test user', async () => {
		await exports.deleteTestUser()
	})
}

exports.loginAsUser = async (agent, username) => {
	return await agent.post('/auth/login')
		.send({ username: username, password: username })
}
