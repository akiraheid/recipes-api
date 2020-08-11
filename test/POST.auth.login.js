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

describe('POST /auth/login', () => {
	let agent = undefined

	util.freshTestUserHooks()

	beforeEach('create request agent', async () => {
		agent = chai.request.agent(URL)
	})

	afterEach('close request agent', async () => {
		agent.close()
	})

	it('returns 200 with default data when login successful', async () => {
		const res = await login(agent, testUsername)
		expect(res).to.have.status(200)
		expect(res).to.have.header('set-cookie')
	})

	it('returns 400 when bad username/password', async () => {
		const res = await login(agent, 'fakeaccount')
		expect(res).to.have.status(400)
		expect(res).to.not.have.header('set-cookie')
	})
})
