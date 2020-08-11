/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

// Global test URL
const URL = 'http://localhost:8080'
exports.testUrl = URL

const testUsername = 'testtest'
exports.testUsername = testUsername

// Every endpoint should not respond to garbage data or data that does not
// match the schema. Send requests on all HTTP methods and ensure there's no
// response for garbage sent.
exports.testEndpointWithGarbage = (endpoint) => {
	describe('Endpoint garbage handling', () => {
		describe(`${endpoint} recieves GET garbage`, () => {
			it('should respond with 400', function(done) {
				chai.request(`${URL}`)
					.get(endpoint)
					.end(function(err, res) {
						expect(res).to.have.status(404)
						done()
					})
			})
		})
	})
}

exports.createTestUser = async () => {
	const res = await chai.request(URL)
		.post('/user')
		.send({ username: testUsername, password: testUsername })

	return res.status === 200
}

exports.deleteTestUser = async () => {
	await exports.deleteUser(testUsername)
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
