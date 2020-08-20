/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

describe('DELETE /user/:id authenticated', () => {
	let agent = undefined

	beforeEach(async () => {
		agent = util.createAgent()

		await util.deleteUser(testUsername)

		// Create user and store auth token in agent
		const res = await agent.post('/user')
			.send({ username: testUsername, password: testUsername })

		expect(res).to.have.status(200)
	})

	afterEach(async () => { agent.close() })

	it('returns 200 for existing user', async () => {
		const res = await agent.delete(`/user/${testUsername}`)
		expect(res).to.have.status(200)
	})
})

describe('DELETE /user/:id authenticated delete another user', () => {
	let agent = undefined
	const otherUsername = 'otheruser'

	beforeEach(async () => {
		agent = util.createAgent()

		await util.deleteUser(testUsername)

		// Create user and store auth token in agent
		const res = await agent.post('/user')
			.send({ username: testUsername, password: testUsername })

		expect(res).to.have.status(200)

		// Create other user
		await util.createUser(otherUsername)
	})

	afterEach(async () => {
		agent.close()
		await util.deleteUser(otherUsername)
		await util.deleteUser(testUsername)
	})

	it('returns 401', async () => {
		const res = await agent.delete(`/user/${otherUsername}`)
		expect(res).to.have.status(401)
	})
})

describe('DELETE /user/:id unauthenticated', () => {
	it('returns 401', async () => {
		const nonExistentUsername = 'Idontexistnaenae'
		const res = await chai.request(URL)
			.delete(`/user/${nonExistentUsername}`)

		expect(res).to.have.status(401)
	})
})
