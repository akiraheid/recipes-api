/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

const login = async (agent, username) => {
	return await agent.post('/auth/login')
		.send({ username: username, password: username })
}

describe('POST /auth/logout', () => {
	let agent = undefined

	util.freshTestUserHooks()

	beforeEach('create request agent', async () => {
		agent = chai.request.agent(URL)
	})

	afterEach('close request agent', async () => {
		agent.close()
	})

	it('returns 200 when successfully logged out', async () => {
		let res = await login(agent, testUsername)
		expect(res).to.have.status(200)

		res = await agent.post('/auth/logout')
		expect(res).to.have.status(200)
	})
})
