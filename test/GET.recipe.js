/*global describe, it*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const util = require('./util')

const testUsername = util.testUsername

describe('GET /recipe?t=xxx', () => {
	util.freshUserHooks()

	it('returns 200 with array of recipes when matches', async () => {
		await util.addRecipe(testUsername)
		const recipes = await util.findRecipes('recipe')
		expect(recipes).to.have.lengthOf(1)

		const defaultRecipe = util.createRecipe()
		defaultRecipe.ownerName = testUsername

		const recipe = recipes[0]
		expect(recipe).to.have.property('_id')
		delete recipe._id

		// Remove id information to make deep-equal check easier
		expect(recipe).to.have.property('ownerID')
		delete recipe.ownerID
		expect(recipe).to.have.property('ingredients')
		expect(recipe.ingredients).to.have.lengthOf(2)
		delete recipe.ingredients[0]._id
		delete recipe.ingredients[1]._id
		expect(recipe).to.deep.equal(defaultRecipe)
	})

	it('returns 200 and empty array when no matches', async () => {
		const recipes = await util.findRecipes('doesnotexist')
		expect(recipes).to.have.lengthOf(0)
	})
})

describe('GET /recipe/:id', () => {
	util.freshUserHooks()

	it('returns 200 with recipe when exists', async () => {
		await util.addRecipe(testUsername)
		const recipes = await util.getRecipes(testUsername)
		expect(recipes).to.have.lengthOf(1)

		const recipe = recipes[0]
		expect(recipe).to.have.property('_id')
		const id = recipe._id

		const defaultRecipe = util.createRecipe()
		const res = await util.get(`/recipe/${id}`)
		expect(res).to.have.status(200)
		expect(res).to.have.property('body')
		expect(res.body).to.have.property('_id')
		expect(res.body._id).to.equal(id)
		expect(res.body).to.have.property('directions')
		expect(res.body.directions).to.deep.equal(defaultRecipe.directions)

		// Remove id information from the ingredients to make deep-equal check
		// easier
		expect(res.body).to.have.property('ingredients')
		expect(res.body.ingredients).to.have.lengthOf(2)
		delete res.body.ingredients[0]._id
		delete res.body.ingredients[1]._id
		expect(res.body.ingredients).to.deep.equal(defaultRecipe.ingredients)
		expect(res.body).to.have.property('name')
		expect(res.body.name).to.equal(defaultRecipe.name)
		expect(res.body).to.have.property('servings')
		expect(res.body.servings).to.equal(defaultRecipe.servings)
	})

	it('returns 400 when not exist', async () => {
		const res = await util.get('/recipe/12345678901234567890abcd')
		expect(res).to.have.status(400)
	})
})
