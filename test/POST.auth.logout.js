/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('POST /auth/logout authenticated', () => {
	let agent = undefined

	util.freshUserHooks()

	beforeEach('create request agent', async () => {
		agent = util.createAgent()
	})

	afterEach('close request agent', async () => { agent.close() })

	it('returns 200 when successfully logged out', async () => {
		let res = await agent.post('/auth/login')
			.send({ username: testUsername, password: testUsername })

		expect(res).to.have.status(200)

		res = await agent.post('/auth/logout')
		expect(res).to.have.status(200)
	})
})

describe('POST /auth/logout unauthenticated', () => {
	let agent = undefined

	util.freshUserHooks()

	beforeEach('create request agent', async () => {
		agent = util.createAgent()
	})

	afterEach('close request agent', async () => { agent.close() })

	it('returns 400', async () => {
		const res = await agent.post('/auth/logout')
		expect(res).to.have.status(400)
	})
})
