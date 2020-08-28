/*global afterEach, beforeEach, describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('DELETE /recipe/:id authenticated', () => {
	util.freshUserHooks()

	it('returns 200 with recipe when exists', async () => {
		await util.addRecipe(testUsername)
		const recipes = await util.getRecipes(testUsername)
		expect(recipes).to.have.lengthOf(1)

		const recipe = recipes[0]
		expect(recipe).to.have.property('_id')
		const id = recipe._id

		await util.deleteRecipe(id, testUsername)

		const res = await util.get(`/recipe/${id}`)
		expect(res).to.have.status(400)
	})

	it('returns 400 when not exist', async () => {
		const agent = util.createAgent()
		const loginRes = await agent.post('/auth/login')
			.send({ username: testUsername, password: testUsername })

		const res = await agent.delete('/recipe/12345678901234567890abcd')
		agent.close()

		expect(loginRes).to.have.status(200)
		expect(res).to.have.status(400)
	})
})

describe('DELETE /recipe/:id authenticated as other user', () => {
	const otherUser = 'otheruser'

	util.freshUserHooks()

	let agent = undefined

	beforeEach('create other user', async () => {
		agent = util.createAgent()
		await util.createUser(otherUser)

		const res = await agent.post('/auth/login')
			.send({ username: testUsername, password: testUsername })

		expect(res).to.have.status(200)
	})

	afterEach('delete other user', async () => {
		agent.close()
		await util.deleteUser(otherUser)
	})

	it('returns 400 deleting recipe owned by other user', async () => {
		await util.addRecipe(otherUser)
		const recipes = await util.getRecipes(otherUser)
		expect(recipes).to.have.lengthOf(1)

		const recipe = recipes[0]
		expect(recipe).to.have.property('_id')
		const id = recipe._id

		let res = await agent.delete(`/recipe/${id}`)
		expect(res).to.have.status(400)

		res = await util.get(`/recipe/${id}`)
		expect(res).to.have.status(200)
	})
})

describe('DELETE /recipe/:id unauthenticated', () => {
	it('returns 400', async () => {
		const res = await util.delete('/recipe/12345678901234567890abcd')
		expect(res).to.have.status(400)
	})
})
