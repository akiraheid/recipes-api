/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('DELETE /pantry unauthenticated', () => {
	it('returns 400', async () => {
		const data = util.createRecipe()
		const res = await util.post('/pantry', data)
		expect(res).to.have.status(400)
	})
})

describe('DELETE /pantry authenticated', () => {
	util.freshUserHooks()

	it('returns 200 and pantry item deleted', async () => {
		await util.addPantryItem(testUsername)
		let pantry = await util.getPantry(testUsername)

		// Expect user now has one item
		expect(pantry).to.have.lengthOf(1)
		const item = pantry[0]
		const itemId = item._id

		// Delete the item
		await util.deletePantryItem(testUsername, itemId)

		// Verify
		pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(0)
	})
})
