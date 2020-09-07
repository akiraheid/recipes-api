/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('POST /pantry unauthenticated', () => {
	it('returns 400', async () => {
		const data = util.createRecipe()
		const res = await util.post('/pantry', data)
		expect(res).to.have.status(400)
	})
})

describe('POST /pantry authenticated', () => {
	util.freshUserHooks()

	it('returns 200 and user has new item', async () => {
		// Expect user to have no pantry items
		let pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(0)

		const item = util.createPantryItem()
		await util.addPantryItem(testUsername, item)
		pantry = await util.getPantry(testUsername)

		// Expect user now has one item
		expect(pantry).to.have.lengthOf(1)
		const thing = pantry[0]
		expect(thing).has.property('_id')
		expect(thing).has.property('dateAdded')

		expect(thing).has.property('amount')
		expect(thing.amount).equals(item.amount)
		expect(thing).has.property('expire')
		expect(thing.expire).equals(null)
		expect(thing).has.property('name')
		expect(thing.name).equals(item.name)
		expect(thing).has.property('unit')
		expect(thing.unit).equals(item.unit)
	})

	it('returns 200 and user has item updated', async () => {
		// Expect user to have no pantry items
		let pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(0)

		// Add pantry item
		let item = await util.createPantryItem()
		util.addPantryItem(testUsername, item)

		pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(1)

		// Change item and push update
		item = pantry[0]
		const newName = 'new name'
		expect(item.name).not.equal(newName)
		item.name = newName
		expect(item).to.have.property('_id')
		util.updatePantryItem(testUsername, item)

		// Verify update
		pantry = await util.getPantry(testUsername)
		expect(pantry).to.have.lengthOf(1)
		const checkItem = pantry[0]
		expect(checkItem).to.deep.equal(item)
	})
})
