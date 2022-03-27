module.exports = class Game {
	constructor(){
		this.players = []
	}

	addPlayer(player){
		this.players.push(player)
	}

	getPlayer(id){
		return this.players.find(player => player.id === id)
	}

	removePlayer(id){
		this.players = this.players.filter(player => player.id !== id)
	}
}