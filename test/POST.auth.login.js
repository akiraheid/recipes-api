/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

const login = async (username) => {
	return await chai.request(URL).post('/auth/login')
		.send({ username: username, password: username })
}

describe('POST /auth/login', () => {
	util.freshUserHooks()

	it('returns 200 with default data when login successful', async () => {
		const res = await login(testUsername)
		expect(res).to.have.status(200)
		expect(res).to.have.header('set-cookie')
	})

	it('returns 400 when bad username/password', async () => {
		const res = await login('fakeaccount')
		expect(res).to.have.status(400)
		expect(res).to.not.have.header('set-cookie')
	})
})
