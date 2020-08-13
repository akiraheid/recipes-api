/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

const send = async (path) => {
	return await chai.request(URL).get(path)
}

describe('GET /user/:id unauthenticated', () => {
	util.freshTestUserHooks()

	it('returns 200 with public user data when user exists', async () => {
		const res = await send(`/user/${testUsername}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')

		expect(res.body).to.deep.equal({
			_id: res.body._id,
			name: testUsername,
			recipes: [],
		})
	})

	it('returns 400 when user doesn\'t exist', async () => {
		const nonExistentUser = 'idunexisthurhur'
		await util.deleteUser(nonExistentUser)
		const res = await send(`/user/${nonExistentUser}`)

		expect(res).to.have.status(400)
	})
})

describe('GET /user/:id authenticated but not owner', () => {
	let agent = undefined
	const otherUser = 'otheruser'

	util.freshTestUserHooks()

	beforeEach(async () => {
		agent = util.createAgent()
		await util.createUser(otherUser)
	})

	afterEach(async () => {
		await util.deleteUser(otherUser)
		agent.close()
	})

	it('returns 200 and user\'s public data', async () => {
		let res = await util.loginAsUser(agent, testUsername)
		expect(res).to.have.status(200)

		res = await agent.get(`/user/${otherUser}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')

		expect(res.body).to.deep.equal({
			_id: res.body._id,
			name: otherUser,
			recipes: [],
		})
	})
})

describe('GET /user/:id authenticated and id == user', () => {
	let agent = undefined

	util.freshTestUserHooks()

	beforeEach('create request agent', async () => {
		agent = util.createAgent()
	})

	afterEach('close request agent', async () => {
		agent.close()
	})

	it('returns 200 with private user data when user exists', async () => {
		let res = await util.loginAsUser(agent, testUsername)
		expect(res).to.have.status(200)

		res = await agent.get(`/user/${testUsername}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.be.a('string')

		expect(res.body).to.deep.equal({
			_id: res.body._id,
			name: testUsername,
			pantry: [],
			recipes: [],
		})
	})
})
