module.exports = class Player {
	constructor(id){
		this.id = id
		this.x = 250
		this.dx = 0;
		this.y = 250
		this.yx = 0;
		this.size = 24
		this.speed = 1
	}
	setUsername(username){
		this.username = username
	}
	rotateRight(){
		this.dx += this.speed
	}
	rotateLeft(){
		this.dx -= this.speed
	}
	moveForward(){

	}
	moveBackward(){

	}
	update(){
		this.x += this.dx
		this.y += this.yx
	}
}