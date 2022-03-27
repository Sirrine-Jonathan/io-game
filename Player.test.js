const Player = require("./Player")

describe('Player', () => {
	let player = new Player('TEST_ID')
	it('intializes player with id', () => {
		expect(player.id).toEqual('TEST_ID')
	})
})