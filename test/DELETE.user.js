/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const URL = util.testUrl
const testUsername = util.testUsername

const send = async (path) => {
	return await chai.request(URL).delete(path)
}

describe('DELETE /user/:id', () => {
	util.freshTestUserHooks()

	it('returns 200 for existing user', async function() {
		const res = await send(`/user/${testUsername}`)
		expect(res).to.have.status(200)
	})

	it('returns 400 for non-existent user', async function() {
		const nonExistentUsername = 'Idontexistnaenae'
		await util.deleteUser(nonExistentUsername)

		const res = await send(`/user/${nonExistentUsername}`)
		expect(res).to.have.status(400)
	})
})
