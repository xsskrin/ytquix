

class Player {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.size = 40;
	}

	update() {
		this.y += 1;
		if (this.y > this.game.H - this.size) {
			this.y = this.game.H - this.size;
		}
	}

	draw() {
		this.game.ctx.fillRect(
			this.x, this.y, this.size, this.size
		);
	}
}

export default Player;
