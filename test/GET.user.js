/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

describe('GET /user/:id', () => {
	util.freshTestUserHooks()

	it('returns 200 with user data', async () => {
		const res = await chai.request(URL)
			.get(`/user/${testUsername}`)

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
