

class Player {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.speedY = 3;
		this.accY = .5;
		this.size = 40;
	}

	update() {
		this.y += this.speedY;
		this.speedY += this.accY;
		this.accY += .3;

		if (this.y > this.game.H - this.size) {
			this.y = this.game.H - this.size;
			this.speedY = 0;
			this.accY = 0;
		}

		if (this.game.pressed.w && this.speedY === 0) {
			this.accY = -4;
		}
	}

	draw() {
		this.game.ctx.fillRect(
			this.x, this.y, this.size, this.size
		);
	}
}

export default Player;
