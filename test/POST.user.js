/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

describe('POST /user', () => {
	beforeEach('delete test user', util.deleteTestUser)
	afterEach('delete test user', util.deleteTestUser)

	it('returns 400 for passwords less than 8 characters', async () => {
		const data = {
			name: testUsername,
			pass: 'ab',
		}
		const res = await chai.request(URL)
			.post('/user')
			.send(data)

		expect(res).to.have.status(400)
		expect(res.body).to.have.property('msg')
		expect(res.body.msg).to.be.a('string')
	})

	it('returns 200 with default data when user created', async () => {
		const data = {
			name: testUsername,
			pass: 'testtest',
		}
		const res = await chai.request(URL)
			.post('/user')
			.send(data)

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
