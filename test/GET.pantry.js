/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('GET /pantry unauthenticated', () => {
	it('returns 400', async () => {
		const res = await util.get('/pantry')
		expect(res).to.have.status(400)
	})
})


describe('GET /pantry authenticated', () => {
	util.freshUserHooks()

	it('returns 200 and returns user pantry items', async () => {
		// Expect user to have no pantry items
		const pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(0)
	})
})
