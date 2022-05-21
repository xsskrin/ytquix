

class Platform {
	constructor(game, x, y, width, height) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speedX = 3;
	}

	update() {
		this.prevY = this.y;

		this.x += this.speedX;
		if (this.x > this.game.W - this.width) {
			this.x = this.game.W - this.width;
			this.speedX *= -1;
		} else if (this.x < 0) {
			this.x = 0;
			this.speedX *= -1;
		}
	}

	draw() {
		this.game.ctx.fillRect(
			this.x, this.y, this.width, this.height,
		);
	}
}

export default Platform;
