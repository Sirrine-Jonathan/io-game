const Game = require("./Game")
const Player = require("./Player")

describe('Game', () => {
	it('intializes an empty array of players', () => {
		let game = new Game()
		expect(game.players).toEqual([])
	})
	it('correctly adds and removes players', () => {
		let game = new Game()
		const player = new Player('TEST_ID')
		game.addPlayer(player)
		expect(game.players.length).toEqual(1)
		expect(game.players.map(player => player.id)).toEqual(['TEST_ID'])
		game.removePlayer(player.id)
		expect(game.players.length).toEqual(0)
		expect(game.players.map(player => player.id)).toEqual([])
	})
})